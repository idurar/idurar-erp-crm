const mongoose = require('mongoose');

const list = async (req, res) => {
  const AuditLog = mongoose.model('AuditLog');
  const limit = Math.min(Math.max(Number(req.query.limit) || 100, 1), 500);
  const result = await AuditLog.find({})
    .select('actorEmail actorRole action path status requestId createdAt')
    .sort({ createdAt: -1 })
    .limit(limit)
    .lean();
  return res.status(200).json({ success: true, result });
};

module.exports = { list };
