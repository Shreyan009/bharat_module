const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const pool   = require('../config/db');
const { requireAuth } = require('../middleware/auth');

// ── POST /api/onboarding ───────────────────────────────────────────────────
// Called from onboarding2.html multi-step form on final submit
router.post('/', requireAuth, [
  body('company_name').trim().notEmpty().withMessage('Company name required'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const {
    company_name, gstin, pan, address, city, state, pincode,
    certifications = [], annual_turnover, employee_count,
    product_types = [], website,
  } = req.body;

  try {
    // Upsert: if user re-submits onboarding, update instead of error
    await pool.query(
      `INSERT INTO oem_profiles
         (user_id, company_name, gstin, pan, address, city, state, pincode,
          certifications, annual_turnover, employee_count, product_types, website)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       ON CONFLICT (user_id) DO UPDATE SET
         company_name    = EXCLUDED.company_name,
         gstin           = EXCLUDED.gstin,
         pan             = EXCLUDED.pan,
         address         = EXCLUDED.address,
         city            = EXCLUDED.city,
         state           = EXCLUDED.state,
         pincode         = EXCLUDED.pincode,
         certifications  = EXCLUDED.certifications,
         annual_turnover = EXCLUDED.annual_turnover,
         employee_count  = EXCLUDED.employee_count,
         product_types   = EXCLUDED.product_types,
         website         = EXCLUDED.website`,
      [req.user.id, company_name, gstin, pan, address, city, state, pincode,
       certifications, annual_turnover, employee_count, product_types, website]
    );

    // Also update the users.company field
    await pool.query(
      'UPDATE users SET company = $1 WHERE id = $2',
      [company_name, req.user.id]
    );

    res.status(201).json({ message: 'Onboarding complete. Welcome to Bharat Modules.' });
  } catch (err) {
    console.error('Onboarding error:', err);
    res.status(500).json({ error: 'Could not save onboarding data. Please try again.' });
  }
});

// ── GET /api/onboarding/me ─────────────────────────────────────────────────
router.get('/me', requireAuth, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM oem_profiles WHERE user_id = $1',
      [req.user.id]
    );
    res.json({ profile: result.rows[0] || null });
  } catch (err) {
    console.error('Get onboarding error:', err);
    res.status(500).json({ error: 'Could not fetch onboarding profile' });
  }
});

module.exports = router;
