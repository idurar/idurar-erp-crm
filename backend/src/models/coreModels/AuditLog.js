const mongoose = require('mongoose');

const auditLogSchema = new mongoose.Schema(
  {
    actor: { type: mongoose.Schema.ObjectId, ref: 'Admin', index: true },
    actorEmail: { type: String, lowercase: true, trim: true },
    actorRole: { type: String, trim: true },
    action: { type: String, required: true, index: true },
    path: { type: String, required: true },
    status: { type: Number, required: true },
    requestId: { type: String, index: true },
    ip: { type: String },
    userAgent: { type: String },
  },
  { timestamps: true, versionKey: false }
);

auditLogSchema.index({ createdAt: -1 });

module.exports = mongoose.model('AuditLog', auditLogSchema);
