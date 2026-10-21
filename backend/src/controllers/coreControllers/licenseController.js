const { activateLicense, getLicenseStatus } = require('@/services/licenseService');

const status = async (_req, res) => {
  const result = await getLicenseStatus();
  return res.status(200).json({ success: true, result });
};

const activate = async (req, res) => {
  const result = await activateLicense(req.body?.licenseKey);
  if (result.status === 'invalid') {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Der Lizenzschlüssel ist ungültig.',
    });
  }
  if (result.status === 'assigned') {
    const support = process.env.SUPPORT_EMAIL?.trim();
    return res.status(409).json({
      success: false,
      result: null,
      message:
        `Dieser Lizenzschlüssel wurde bereits vergeben. Bitte wenden Sie sich an den Support${
          support ? ` (${support})` : ''
        }.`,
    });
  }
  return res.status(200).json({
    success: true,
    result: { licensed: true, activatedAt: result.activatedAt || null },
    message: 'Lizenz erfolgreich aktiviert.',
  });
};

module.exports = { activate, status };
