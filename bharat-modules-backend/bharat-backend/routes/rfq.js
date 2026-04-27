const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const pool   = require('../config/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');
const { sendRfqConfirmation, notifyTeamRfq } = require('../config/email');

// ── POST /api/rfq ──────────────────────────────────────────────────────────
// Called when buyer submits rfq_cart.html
// Body: { items: [{ product_id?, product_name, sku, quantity, unit?, notes? }], notes? }
router.post('/', requireAuth, [
  body('items').isArray({ min: 1 }).withMessage('Cart must have at least one item'),
  body('items.*.product_name').trim().notEmpty().withMessage('Product name required'),
  body('items.*.sku').trim().notEmpty().withMessage('SKU required'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be a positive integer'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { items, notes } = req.body;
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // Human-readable RFQ number: BM-2025-01234
    const seqRes  = await client.query("SELECT nextval('rfq_seq') AS n");
    const rfqNum  = `BM-${new Date().getFullYear()}-${String(seqRes.rows[0].n).padStart(5, '0')}`;

    const rfqRes  = await client.query(
      `INSERT INTO rfqs (rfq_number, user_id, notes)
       VALUES ($1, $2, $3) RETURNING *`,
      [rfqNum, req.user.id, notes || null]
    );
    const rfq = rfqRes.rows[0];

    // Insert line items
    for (const item of items) {
      await client.query(
        `INSERT INTO rfq_items (rfq_id, product_id, product_name, sku, quantity, unit, notes)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [rfq.id, item.product_id || null, item.product_name, item.sku,
         item.quantity, item.unit || 'units', item.notes || null]
      );
    }

    await client.query('COMMIT');

    // Fetch buyer info for emails
    const buyerRes = await pool.query(
      'SELECT name, email, company, phone FROM users WHERE id = $1',
      [req.user.id]
    );
    const buyer = buyerRes.rows[0];

    // Send emails (don't block response on this)
    Promise.all([
      sendRfqConfirmation(buyer, rfq, items),
      notifyTeamRfq(buyer, rfq, items),
    ]).catch(err => console.error('RFQ email error:', err));

    res.status(201).json({
      message: 'RFQ submitted successfully',
      rfq: {
        id: rfq.id,
        rfq_number: rfq.rfq_number,
        status: rfq.status,
        created_at: rfq.created_at,
        item_count: items.length,
      },
    });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('RFQ submit error:', err);
    res.status(500).json({ error: 'Could not submit RFQ. Please try again.' });
  } finally {
    client.release();
  }
});

// ── GET /api/rfq/my ────────────────────────────────────────────────────────
// Buyer's RFQ history — used by customer_dashboard
router.get('/my', requireAuth, async (req, res) => {
  try {
    const rfqsRes = await pool.query(
      `SELECT r.id, r.rfq_number, r.status, r.notes, r.created_at, r.updated_at,
              COUNT(ri.id)::int AS item_count
       FROM rfqs r
       LEFT JOIN rfq_items ri ON ri.rfq_id = r.id
       WHERE r.user_id = $1
       GROUP BY r.id
       ORDER BY r.created_at DESC`,
      [req.user.id]
    );
    res.json({ rfqs: rfqsRes.rows });
  } catch (err) {
    console.error('My RFQs error:', err);
    res.status(500).json({ error: 'Could not fetch RFQs' });
  }
});

// ── GET /api/rfq/:id ───────────────────────────────────────────────────────
// Full RFQ detail with line items — buyer can only see their own
router.get('/:id', requireAuth, async (req, res) => {
  try {
    const rfqRes = await pool.query(
      `SELECT r.*, u.name as buyer_name, u.email as buyer_email, u.company
       FROM rfqs r
       JOIN users u ON u.id = r.user_id
       WHERE r.id = $1 AND (r.user_id = $2 OR $3 = 'admin')`,
      [req.params.id, req.user.id, req.user.role]
    );
    if (!rfqRes.rows[0]) return res.status(404).json({ error: 'RFQ not found' });

    const itemsRes = await pool.query(
      `SELECT ri.*, p.images[1] as product_image
       FROM rfq_items ri
       LEFT JOIN products p ON p.id = ri.product_id
       WHERE ri.rfq_id = $1`,
      [req.params.id]
    );

    res.json({ rfq: { ...rfqRes.rows[0], items: itemsRes.rows } });
  } catch (err) {
    console.error('RFQ detail error:', err);
    res.status(500).json({ error: 'Could not fetch RFQ' });
  }
});

// ── GET /api/rfq (admin) ───────────────────────────────────────────────────
// Admin: see all RFQs with pagination and status filter
router.get('/', requireAuth, requireAdmin, async (req, res) => {
  const page   = Math.max(1, parseInt(req.query.page) || 1);
  const limit  = Math.min(50, parseInt(req.query.limit) || 20);
  const offset = (page - 1) * limit;
  const status = req.query.status || null;

  try {
    const params     = [];
    const conditions = [];
    let pi = 1;

    if (status) {
      conditions.push(`r.status = $${pi++}`);
      params.push(status);
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    const countRes = await pool.query(`SELECT COUNT(*) FROM rfqs r ${where}`, params);
    const total    = parseInt(countRes.rows[0].count);

    const rfqsRes  = await pool.query(
      `SELECT r.id, r.rfq_number, r.status, r.created_at,
              u.name as buyer_name, u.email as buyer_email, u.company,
              COUNT(ri.id)::int as item_count
       FROM rfqs r
       JOIN users u ON u.id = r.user_id
       LEFT JOIN rfq_items ri ON ri.rfq_id = r.id
       ${where}
       GROUP BY r.id, u.name, u.email, u.company
       ORDER BY r.created_at DESC
       LIMIT $${pi++} OFFSET $${pi++}`,
      [...params, limit, offset]
    );

    res.json({
      rfqs: rfqsRes.rows,
      pagination: { total, page, limit, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error('Admin RFQs error:', err);
    res.status(500).json({ error: 'Could not fetch RFQs' });
  }
});

// ── PATCH /api/rfq/:id/status (admin) ─────────────────────────────────────
router.patch('/:id/status', requireAuth, requireAdmin, [
  body('status').isIn(['submitted','reviewing','quoted','closed']).withMessage('Invalid status'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const result = await pool.query(
      `UPDATE rfqs SET status = $1, updated_at = NOW()
       WHERE id = $2 RETURNING *`,
      [req.body.status, req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'RFQ not found' });
    res.json({ rfq: result.rows[0] });
  } catch (err) {
    console.error('RFQ status update error:', err);
    res.status(500).json({ error: 'Could not update RFQ status' });
  }
});

module.exports = router;
