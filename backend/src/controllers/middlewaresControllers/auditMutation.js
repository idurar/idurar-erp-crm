const mongoose = require('mongoose');
const logger = require('@/utils/logger');

module.exports = (req, res, next) => {
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) return next();

  res.on('finish', () => {
    if (!req.admin || res.statusCode >= 500) return;
    const AuditLog = mongoose.models.AuditLog;
    if (!AuditLog) return;
    AuditLog.create({
      actor: req.admin._id,
      actorEmail: req.admin.email,
      actorRole: req.admin.role,
      action: req.method,
      path: req.originalUrl.split('?')[0],
      status: res.statusCode,
      requestId: req.requestId,
      ip: req.ip,
      userAgent: req.get('user-agent'),
    }).catch((error) => logger.error('Audit log write failed', { message: error.message }));
  });
  next();
};
