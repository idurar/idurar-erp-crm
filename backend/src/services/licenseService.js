const crypto = require('crypto');
const mongoose = require('mongoose');

const LICENSE_PATTERN = /^WIEPILOT(?:-[A-Z0-9]{8}){6}$/;

const licenseKeySchema = new mongoose.Schema({
  keyHash: { type: String, required: true, unique: true },
  status: { type: String, enum: ['active', 'revoked'], default: 'active' },
  activatedInstallationId: String,
  activatedAt: Date,
  created: { type: Date, default: Date.now },
});
licenseKeySchema.index(
  { activatedInstallationId: 1 },
  {
    unique: true,
    partialFilterExpression: { activatedInstallationId: { $type: 'string' } },
  }
);

let connectionPromise;
const getLicenseModel = async () => {
  if (!connectionPromise) {
    const uri = process.env.LICENSE_DATABASE || process.env.DATABASE;
    const connection = mongoose.createConnection(uri, { autoIndex: true });
    connectionPromise = connection.asPromise().catch(async (error) => {
      connectionPromise = undefined;
      await connection.close().catch(() => undefined);
      throw error;
    });
  }
  const connection = await connectionPromise;
  const LicenseKey = connection.models.LicenseKey || connection.model('LicenseKey', licenseKeySchema);
  await LicenseKey.init();
  return LicenseKey;
};

const normalizeLicenseKey = (value = '') => String(value).trim().toUpperCase();
const hashLicenseKey = (value) =>
  crypto.createHash('sha256').update(normalizeLicenseKey(value)).digest('hex');

const getInstallationId = async () => {
  if (process.env.LICENSE_INSTANCE_ID?.trim()) return process.env.LICENSE_INSTANCE_ID.trim();
  const Setting = mongoose.model('Setting');
  let setting = await Setting.findOne({
    settingKey: 'license_installation_id',
    removed: false,
  });
  if (!setting) {
    try {
      setting = await Setting.create({
        settingCategory: 'system',
        settingKey: 'license_installation_id',
        settingValue: crypto.randomUUID(),
        valueType: 'string',
        isPrivate: true,
        isCoreSetting: true,
      });
    } catch (error) {
      if (error?.code !== 11000) throw error;
      setting = await Setting.findOne({
        settingKey: 'license_installation_id',
        removed: false,
      });
    }
  }
  return String(setting.settingValue);
};

const getLicenseStatus = async () => {
  if (process.env.LICENSE_ENFORCEMENT === 'false') {
    return { licensed: true, developmentBypass: true };
  }
  const [LicenseKey, installationId] = await Promise.all([
    getLicenseModel(),
    getInstallationId(),
  ]);
  const license = await LicenseKey.findOne({
    status: 'active',
    activatedInstallationId: installationId,
  }).lean();
  return {
    licensed: Boolean(license),
    activatedAt: license?.activatedAt || null,
  };
};

const activateLicense = async (licenseKey) => {
  const normalizedKey = normalizeLicenseKey(licenseKey);
  if (!LICENSE_PATTERN.test(normalizedKey)) return { status: 'invalid' };

  const [LicenseKey, installationId] = await Promise.all([
    getLicenseModel(),
    getInstallationId(),
  ]);
  const keyHash = hashLicenseKey(normalizedKey);
  await LicenseKey.updateMany(
    { status: 'revoked', activatedInstallationId: installationId },
    { $unset: { activatedInstallationId: 1 } }
  );
  const existing = await LicenseKey.findOne({ keyHash }).lean();
  if (!existing || existing.status !== 'active') return { status: 'invalid' };
  if (
    existing.activatedInstallationId &&
    existing.activatedInstallationId !== installationId
  ) {
    return { status: 'assigned' };
  }
  if (existing.activatedInstallationId === installationId) {
    return { status: 'activated', activatedAt: existing.activatedAt };
  }

  try {
    const activatedAt = new Date();
    const activated = await LicenseKey.findOneAndUpdate(
      {
        keyHash,
        status: 'active',
        $or: [
          { activatedInstallationId: { $exists: false } },
          { activatedInstallationId: null },
          { activatedInstallationId: installationId },
        ],
      },
      {
        $set: {
          activatedInstallationId: installationId,
          activatedAt,
        },
      },
      { new: true }
    ).lean();
    if (!activated) return { status: 'assigned' };
    return { status: 'activated', activatedAt: activated.activatedAt };
  } catch (error) {
    if (error?.code === 11000) {
      const currentStatus = await getLicenseStatus();
      return currentStatus.licensed ? { status: 'activated' } : { status: 'assigned' };
    }
    throw error;
  }
};

const importLicenseHashes = async (hashes) => {
  const LicenseKey = await getLicenseModel();
  if (!hashes.length) return 0;
  const result = await LicenseKey.bulkWrite(
    hashes.map((keyHash) => ({
      updateOne: {
        filter: { keyHash },
        update: { $setOnInsert: { keyHash, status: 'active' } },
        upsert: true,
      },
    }))
  );
  return result.upsertedCount || 0;
};

module.exports = {
  LICENSE_PATTERN,
  activateLicense,
  getLicenseStatus,
  hashLicenseKey,
  importLicenseHashes,
  normalizeLicenseKey,
};
