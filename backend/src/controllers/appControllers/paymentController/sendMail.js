const { sendDocumentEmail } = require('@/services/documentEmail');

module.exports = async (req, res) => {
  const result = await sendDocumentEmail({ modelName: 'Payment', id: req.body.id });
  return res
    .status(result.status)
    .json({
      success: result.status === 200,
      result: result.document || null,
      message:
        result.status === 200 ? 'Zahlungsbestätigung wurde per E-Mail versendet' : result.message,
    });
};
