const pool = require('../config/db');

async function logAudit(actorId, actorName, actorRole, action, entityType, entityId, before, after, req) {
  try {
    const ipAddress = req ? req.ip || req.connection.remoteAddress : null;
    const userAgent = req ? req.get('User-Agent') : null;

    await pool.query(
      `INSERT INTO audit_log 
       (actor_id, actor_name, actor_role, action, entity_type, entity_id, before_state, after_state, ip_address, user_agent) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
      [actorId, actorName, actorRole, action, entityType, entityId, before, after, ipAddress, userAgent]
    );
  } catch (error) {
    console.error('Error logging audit:', error);
  }
}

module.exports = { logAudit };
