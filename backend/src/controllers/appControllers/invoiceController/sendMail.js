const { sendDocumentEmail } = require('@/services/documentEmail');

module.exports = async (req, res) => {
  const result = await sendDocumentEmail({ modelName: 'Invoice', id: req.body.id });
  return res
    .status(result.status)
    .json({
      success: result.status === 200,
      result: result.document || null,
      message: result.status === 200 ? 'Rechnung wurde per E-Mail versendet' : result.message,
    });
};
