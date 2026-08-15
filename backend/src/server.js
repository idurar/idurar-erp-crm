// src/server.js (CommonJS version)

const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const express = require('express');

const app = express();
const PORT = process.env.PORT || 8888;
const DATABASE = process.env.DATABASE;

console.log('DEBUG: Using Mongo URI =', DATABASE);

mongoose.connect(DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log('✅ Connected to MongoDB successfully!'))
  .catch(err => console.error('❌ MongoDB connection error:', err.message));

app.get('/', (req, res) => {
  res.send('Backend running successfully!');
});

app.listen(PORT, () => console.log(`Express running → On PORT: ${PORT}`));
