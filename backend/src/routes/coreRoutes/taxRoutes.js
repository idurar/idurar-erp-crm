const express = require('express');
const router = express.Router();

const {
  createTax,
  getAllTaxes,
  getTaxById,
  updateTax,
  deleteTax,
} = require('../../controllers/taxControllers/tax.controller');

router.post('/', createTax);
router.get('/', getAllTaxes);
router.get('/:id', getTaxById);
router.put('/:id', updateTax);
router.delete('/:id', deleteTax);

module.exports = router;