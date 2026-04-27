// routes/contact.js
const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const pool   = require('../config/db');
const { notifyTeamContact } = require('../config/email');

// ── POST /api/contact ──────────────────────────────────────────────────────
// Wired to contact_us.html form
router.post('/', [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email required'),
  body('message').trim().isLength({ min: 10 }).withMessage('Message too short'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const { name, email, company, phone, subject, message } = req.body;

  try {
    await pool.query(
      `INSERT INTO contact_submissions (name, email, company, phone, subject, message)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [name, email, company || null, phone || null, subject || null, message]
    );

    // Email team (non-blocking)
    notifyTeamContact({ name, email, company, phone, subject, message })
      .catch(err => console.error('Contact email error:', err));

    res.status(201).json({ message: 'Message received. We will get back to you within 24 hours.' });
  } catch (err) {
    console.error('Contact form error:', err);
    res.status(500).json({ error: 'Could not send message. Please try again.' });
  }
});

module.exports = router;
