const requiredVariables = ['DATABASE', 'JWT_SECRET'];

const parseOrigins = (value = '') =>
  value
    .split(',')
    .map((origin) => origin.trim().replace(/\/$/, ''))
    .filter(Boolean);

const validateEnvironment = () => {
  const missing = requiredVariables.filter((name) => !process.env[name]?.trim());

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }
  if (process.env.JWT_SECRET.length < 32) {
    throw new Error('JWT_SECRET must contain at least 32 characters');
  }
  if (process.env.NODE_ENV === 'production' && parseOrigins(process.env.CORS_ORIGINS).length === 0) {
    throw new Error('CORS_ORIGINS is required in production');
  }
};

module.exports = {
  isProduction: process.env.NODE_ENV === 'production',
  parseOrigins,
  validateEnvironment,
};
