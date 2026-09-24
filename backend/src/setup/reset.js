import('dotenv').config({ path: '.env' });
import('dotenv').config({ path: '.env.local' });

import { connect } from 'mongoose';
connect(process.env.DATABASE);

async function deleteData() {
  const Admin = await import('../models/coreModels/Admin');
  const AdminPassword = await import('../models/coreModels/AdminPassword');
  const Setting = await import('../models/coreModels/Setting');
  const PaymentMode = await import('../models/appModels/PaymentMode');
  const Taxes = await import('../models/appModels/Taxes');

  await Admin.deleteMany();
  await AdminPassword.deleteMany();
  await PaymentMode.deleteMany();
  await Taxes.deleteMany();
  console.log('👍 Admin Deleted. To setup demo admin data, run\n\n\t npm run setup\n\n');
  await Setting.deleteMany();
  console.log('👍 Setting Deleted. To setup Setting data, run\n\n\t npm run setup\n\n');

  process.exit();
}

deleteData();
