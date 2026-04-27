const router = require('express').Router();
const { body, query, validationResult } = require('express-validator');
const pool   = require('../config/db');
const { requireAuth, requireAdmin } = require('../middleware/auth');

// ── GET /api/products ──────────────────────────────────────────────────────
// Used by catalogue.html — supports pagination, category filter, and search
router.get('/', async (req, res) => {
  const page     = Math.max(1, parseInt(req.query.page)  || 1);
  const limit    = Math.min(50, parseInt(req.query.limit) || 20);
  const offset   = (page - 1) * limit;
  const category = req.query.cat   || null;
  const search   = req.query.q     || null;

  try {
    const conditions = ['p.is_active = true'];
    const params     = [];
    let   pi         = 1;

    if (category) {
      conditions.push(`p.category ILIKE $${pi++}`);
      params.push(`%${category}%`);
    }

    if (search) {
      conditions.push(
        `to_tsvector('english', p.name || ' ' || COALESCE(p.description,'') || ' ' || p.category)
         @@ plainto_tsquery('english', $${pi++})`
      );
      params.push(search);
    }

    const where = conditions.length ? 'WHERE ' + conditions.join(' AND ') : '';

    // Count for pagination
    const countRes = await pool.query(
      `SELECT COUNT(*) FROM products p ${where}`,
      params
    );
    const total = parseInt(countRes.rows[0].count);

    // Fetch page
    const dataRes = await pool.query(
      `SELECT id, sku, name, category, subcategory, description,
              manufacturer, country_of_origin, certifications,
              specifications, images
       FROM products p
       ${where}
       ORDER BY p.name ASC
       LIMIT $${pi++} OFFSET $${pi++}`,
      [...params, limit, offset]
    );

    res.json({
      products: dataRes.rows,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error('Products list error:', err);
    res.status(500).json({ error: 'Could not fetch products' });
  }
});

// ── GET /api/products/categories ──────────────────────────────────────────
// Used by catalogue sidebar to build category list dynamically
router.get('/categories', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT category, COUNT(*) as count
       FROM products
       WHERE is_active = true
       GROUP BY category
       ORDER BY category`
    );
    res.json({ categories: result.rows });
  } catch (err) {
    console.error('Categories error:', err);
    res.status(500).json({ error: 'Could not fetch categories' });
  }
});

// ── GET /api/products/:id ──────────────────────────────────────────────────
// Product detail page / PDP
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, sku, name, category, subcategory, description,
              manufacturer, country_of_origin, certifications,
              specifications, electrical_specs, compliance, images
       FROM products
       WHERE id = $1 AND is_active = true`,
      [req.params.id]
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: result.rows[0] });
  } catch (err) {
    console.error('Product detail error:', err);
    res.status(500).json({ error: 'Could not fetch product' });
  }
});

// ── POST /api/products ─────────────────────────────────────────────────────
// Admin: add a new product
router.post('/', requireAuth, requireAdmin, [
  body('sku').trim().notEmpty().withMessage('SKU required'),
  body('name').trim().notEmpty().withMessage('Name required'),
  body('category').trim().notEmpty().withMessage('Category required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    sku, name, category, subcategory, description, manufacturer,
    country_of_origin = 'India', certifications = [],
    specifications = {}, electrical_specs = {}, compliance = {}, images = [],
  } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO products
         (sku, name, category, subcategory, description, manufacturer,
          country_of_origin, certifications, specifications, electrical_specs, compliance, images)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12)
       RETURNING *`,
      [sku, name, category, subcategory, description, manufacturer,
       country_of_origin, certifications, specifications, electrical_specs, compliance, images]
    );
    res.status(201).json({ product: result.rows[0] });
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'SKU already exists' });
    console.error('Create product error:', err);
    res.status(500).json({ error: 'Could not create product' });
  }
});

// ── PATCH /api/products/:id ────────────────────────────────────────────────
// Admin: update a product
router.patch('/:id', requireAuth, requireAdmin, async (req, res) => {
  const fields = ['name','category','subcategory','description','manufacturer',
                  'certifications','specifications','electrical_specs','compliance',
                  'images','is_active'];
  const updates = [];
  const values  = [];
  let   pi      = 1;

  for (const field of fields) {
    if (req.body[field] !== undefined) {
      updates.push(`${field} = $${pi++}`);
      values.push(req.body[field]);
    }
  }

  if (!updates.length) return res.status(400).json({ error: 'No fields to update' });
  values.push(req.params.id);

  try {
    const result = await pool.query(
      `UPDATE products SET ${updates.join(', ')} WHERE id = $${pi} RETURNING *`,
      values
    );
    if (!result.rows[0]) return res.status(404).json({ error: 'Product not found' });
    res.json({ product: result.rows[0] });
  } catch (err) {
    console.error('Update product error:', err);
    res.status(500).json({ error: 'Could not update product' });
  }
});

module.exports = router;
