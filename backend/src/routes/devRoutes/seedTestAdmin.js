const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// POST /__dev/seed-test-admin
router.post('/__dev/seed-test-admin', async (req, res) => {
  try {
    const Admin = mongoose.model('Admin');
    const AdminPassword = mongoose.model('AdminPassword');

    const email = req.body.email || 'a@b.com';
    const plain = req.body.password || 'x';

    // remove existing test admin
    await Admin.deleteMany({ email });
    await AdminPassword.deleteMany({});

    const admin = await Admin.create({ email, name: 'Test', surname: 'User', enabled: true });

    // generate salt and bcrypt hash similar to the model
    const crypto = require('crypto');
    const bcrypt = require('bcryptjs');
    const salt = crypto.randomBytes(8).toString('hex');
    const hashed = bcrypt.hashSync(salt + plain);

    await AdminPassword.create({ user: admin._id, password: hashed, salt });

    return res.json({ success: true, message: 'Seed created', email, password: plain, adminId: admin._id });
  } catch (err) {
    console.error('Seed error', err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
