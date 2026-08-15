const { OAuth2Client } = require('google-auth-library');

const verifyGoogleToken = async (idToken) => {
  const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

  try {
    const ticket = await client.verifyIdToken({
      idToken: idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    return {
      sub: payload.sub,
      email: payload.email,
      name: payload.name,
      picture: payload.picture,
      email_verified: payload.email_verified,
    };
  } catch (error) {
    throw new Error('Invalid Google token: ' + error.message);
  }
};

module.exports = { verifyGoogleToken };
