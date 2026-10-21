const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');
const { loadSettings } = require('@/middlewares/settings');

const read = async (req, res) => {
  // Find document by id
  const result = await Model.findOne({
    _id: req.params.id,
    removed: false,
  })
    .populate('createdBy', 'name')
    .exec();
  // If no results found, return document not found
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found ',
    });
  } else {
    const settings = await loadSettings();
    const warnings = [];
    if (!settings.company_name || settings.company_name === 'COMPANY Name')
      warnings.push('Firmenname in den Einstellungen ergänzen.');
    if (!settings.company_address || settings.company_address.includes('Your Company'))
      warnings.push('Vollständige Firmenanschrift ergänzen.');
    if (
      result.taxRate > 0 &&
      (!settings.company_vat_number || settings.company_vat_number === '91231255234')
    )
      warnings.push('Gültige UID-Nummer des Unternehmens ergänzen.');
    if (!result.serviceDate) warnings.push('Leistungsdatum fehlt.');
    if (
      !result.client?.name ||
      !result.client?.address ||
      !result.client?.postalCode ||
      !result.client?.city
    )
      warnings.push('Empfängeranschrift ist unvollständig.');
    if (result.total > 10000 && !result.clientVatNumber)
      warnings.push('Bei Rechnungen über 10.000 EUR fehlt die UID des Empfängers.');
    const responseResult = result.toObject();
    responseResult.complianceWarnings = warnings;
    // Return success resposne
    return res.status(200).json({
      success: true,
      result: responseResult,
      message: 'we found this document ',
    });
  }
};

module.exports = read;
