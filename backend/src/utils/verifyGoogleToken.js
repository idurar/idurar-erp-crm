/**
 * verifyGoogleToken.js
 * Helper to verify Google ID tokens using google-auth-library
 * Exports: async function verifyGoogleToken(idToken) -> returns payload { name, email, picture, email_verified, sub }
 */
const { OAuth2Client } = require('google-auth-library');

// OAuth2Client is initialized lazily to avoid errors when env var is not yet set
let client = null;

function getClient() {
  if (!client) {
    const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    if (!CLIENT_ID) throw new Error('GOOGLE_CLIENT_ID is not defined in environment');
    client = new OAuth2Client(CLIENT_ID);
  }
  return client;
}

/**
 * Verify a Google ID token and return selected payload fields.
 * @param {string} idToken - ID token from Google Identity Services
 * @returns {Promise<Object>} - { name, email, picture, email_verified, sub }
 */
async function verifyGoogleToken(idToken) {
  if (!idToken) throw new Error('Missing ID token');

  try {
    const oauthClient = getClient();
    const ticket = await oauthClient.verifyIdToken({ idToken, audience: process.env.GOOGLE_CLIENT_ID });
    const payload = ticket.getPayload();

    return {
      name: payload.name || null,
      email: payload.email || null,
      picture: payload.picture || null,
      email_verified: payload.email_verified || false,
      sub: payload.sub || null, // Google user id
    };
  } catch (err) {
    // Bubble up a clearer error for controller handling
    const error = new Error('Invalid Google ID token');
    error.cause = err;
    throw error;
  }
}

module.exports = verifyGoogleToken;
