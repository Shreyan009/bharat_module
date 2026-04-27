const jwt = require('jsonwebtoken');
const pool = require('../config/db');

function requireAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }
    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: Insufficient permissions' });
    }
    next();
  };
}

async function requireVerified(req, res, next) {
  try {
    if (!req.user || req.user.role !== 'manufacturer') {
      return res.status(403).json({ error: 'Forbidden: Must be a manufacturer' });
    }
    
    const { rows } = await pool.query(
      'SELECT status FROM manufacturer_profiles WHERE user_id = $1',
      [req.user.id]
    );

    if (rows.length === 0 || rows[0].status !== 'verified') {
      return res.status(403).json({ error: 'Forbidden: Manufacturer account not verified' });
    }
    next();
  } catch (error) {
    console.error('Error in requireVerified middleware:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}

function optionalAuth(req, res, next) {
  try {
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded;
    }
    next();
  } catch (error) {
    next();
  }
}

module.exports = {
  requireAuth,
  requireRole,
  requireVerified,
  optionalAuth
};
