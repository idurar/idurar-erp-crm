// Create a test Admin and AdminPassword for local in-memory MongoDB
require('module-alias/register');
const mongoose = require('mongoose');
const path = require('path');
const Admin = require('../src/models/coreModels/Admin');
const AdminPassword = require('../src/models/coreModels/AdminPassword');

// connect to existing mongoose connection if already connected, else try default uri
async function main() {
  // If mongoose already connected (server script started), use that connection
  console.log('Seed: mongoose readyState =', mongoose.connection && mongoose.connection.readyState);
  if (!mongoose.connection || mongoose.connection.readyState === 0) {
    // Try connecting to default localhost MongoDB (should be the in-memory server printed by server.js)
    const uri = process.env.DATABASE || 'mongodb://127.0.0.1:27017/idurar_test';
    console.log('Seed: connecting to', uri);
    await mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Seed: connected');
  }

  // cleanup any existing test admin with this email
  const email = 'a@b.com';
  console.log('Seed: cleaning existing admins and passwords');
  await Admin.deleteMany({ email });
  await AdminPassword.deleteMany({});

  console.log('Seed: creating admin');
  const admin = await Admin.create({ email, name: 'Test', surname: 'User', enabled: true });

  // create salt and hash like AdminPassword model uses: salt + password hashed with bcrypt
  const crypto = require('crypto');
  const bcrypt = require('bcryptjs');
  const salt = crypto.randomBytes(8).toString('hex');
  const plain = 'x';
  const hashed = bcrypt.hashSync(salt + plain);

  await AdminPassword.create({ user: admin._id, password: hashed, salt });

  console.log('Seed created:', { email, password: plain, adminId: admin._id.toString() });
  process.exit(0);
}

main().catch((err) => { console.error(err); process.exit(1); });
