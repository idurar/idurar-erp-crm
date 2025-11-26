require('dotenv').config({ path: '.env' });
require('dotenv').config({ path: '.env.local' });

const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE);

async function deleteData() {
  // 1. Core Models (Admin & Settings)
  const Admin = require('../models/coreModels/Admin');
  const AdminPassword = require('../models/coreModels/AdminPassword');
  const Setting = require('../models/coreModels/Setting');
  
  // 2. App Models (ERP Configuration)
  const PaymentMode = require('../models/appModels/PaymentMode');
  const Taxes = require('../models/appModels/Taxes');

  // 3. === ADDED: Business Data Models (To prevent "Zombie" data) ===
  // These might be in 'erpModels' or 'appModels' depending on your specific version
  // Check your folder structure if these paths error out.
  const Client = require('../models/appModels/Client'); 
  const Invoice = require('../models/appModels/Invoice');
  const Quote = require('../models/appModels/Quote');
  const Payment = require('../models/appModels/Payment');
  const Offer = require('../models/appModels/Offer');
  const Product = require('../models/appModels/Product');
  const Employee = require('../models/appModels/Employee');

  console.log('⏳ Starting Full Factory Reset...');

  // Delete Business Data First (The Children)
  await Client.deleteMany();
  await Invoice.deleteMany();
  await Quote.deleteMany();
  await Payment.deleteMany();
  await Offer.deleteMany();
  await Product.deleteMany();
  await Employee.deleteMany();
  console.log('👍 Business Data (Clients, Invoices, Payments...) Deleted.');

  // Delete Configuration Data
  await PaymentMode.deleteMany();
  await Taxes.deleteMany();
  await Setting.deleteMany();
  console.log('👍 Settings & Config Deleted.');

  // Delete Admin (The Parent) - Do this last!
  await Admin.deleteMany();
  await AdminPassword.deleteMany();
  console.log('👍 Admin Accounts Deleted.');

  console.log('\n✨ RESET COMPLETE. System is empty.');
  console.log('⚠️  YOU CANNOT LOGIN YET!');
  console.log('👉  Run this command immediately: npm run setup');

  process.exit();
}

deleteData();