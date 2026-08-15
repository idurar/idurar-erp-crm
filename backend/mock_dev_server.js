/**
 * Lightweight mock dev server to simulate /api/google for frontend testing
 * Usage: set JWT_SECRET then `node mock_dev_server.js`
 */
const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/api/google', (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ success: false, result: null, message: 'Missing token' });

  // Simulate extracting profile from token
  const fakeProfile = {
    name: 'Google User',
    email: 'google.user@example.com',
    picture: 'https://via.placeholder.com/150',
  };

  const jwtSecret = process.env.JWT_SECRET || 'dev_jwt_secret';
  const jwtToken = jwt.sign({ id: 'mock-user-id' }, jwtSecret, { expiresIn: '24h' });

  const result = {
    _id: 'mock-user-id',
    name: fakeProfile.name,
    surname: '',
    role: 'owner',
    email: fakeProfile.email,
    photo: fakeProfile.picture,
    token: jwtToken,
    maxAge: null,
  };

  return res.json({ success: true, result, message: 'Successfully logged in (mock)' });
});

app.get('/', (req, res) => res.send('Mock dev server running'));

const port = process.env.PORT || 8888;
app.listen(port, () => console.log(`Mock dev server listening on port ${port}`));
