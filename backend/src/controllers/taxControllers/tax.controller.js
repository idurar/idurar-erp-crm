const Tax = require('../../models/coreModels/tax.model');

// Controller to create a new tax
exports.createTax = async (req, res) => {
  try {
    const { taxName, taxValue, isDefault } = req.body;

    // If setting default, unset others
    if (isDefault) {
      await Tax.updateMany({ isDefault: true }, { isDefault: false });
    }

    const tax = await Tax.create({
      taxName,
      taxValue,
      isDefault,
    });

    res.status(201).json({ success: true, data: tax });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to get all taxes
exports.getAllTaxes = async (req, res) => {
  try {
    const taxes = await Tax.find().sort({ createdAt: -1 });
    res.json({ success: true, data: taxes });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to get tax by ID
exports.getTaxById = async (req, res) => {
  try {
    const tax = await Tax.findById(req.params.id);

    if (!tax) {
      return res.status(404).json({ success: false, message: 'Tax not found' });
    }

    res.json({ success: true, data: tax });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controllers for updating tax
exports.updateTax = async (req, res) => {
  try {
    const { isDefault } = req.body;

    if (isDefault) {
      await Tax.updateMany({ isDefault: true }, { isDefault: false });
    }

    const tax = await Tax.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!tax) {
      return res.status(404).json({ success: false, message: 'Tax not found' });
    }

    res.json({ success: true, data: tax });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Controller to delete a tax
exports.deleteTax = async (req, res) => {
  try {
    const tax = await Tax.findByIdAndDelete(req.params.id);

    if (!tax) {
      return res.status(404).json({ success: false, message: 'Tax not found' });
    }

    res.json({ success: true, message: 'Tax deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};