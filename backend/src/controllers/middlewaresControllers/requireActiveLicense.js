const { getLicenseStatus } = require('@/services/licenseService');

module.exports = async (_req, res, next) => {
  const status = await getLicenseStatus();
  if (status.licensed) return next();
  return res.status(402).json({
    success: false,
    result: null,
    code: 'LICENSE_REQUIRED',
    message: 'Diese Installation benötigt eine gültige Lizenz.',
  });
};
