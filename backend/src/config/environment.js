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
  const insecureSecrets = ['your_jwt_secret', 'change_me', 'secret', 'jwt_secret'];
  if (insecureSecrets.includes(process.env.JWT_SECRET.trim().toLowerCase())) {
    throw new Error('JWT_SECRET must not use a known example value');
  }
  if (process.env.NODE_ENV === 'production' && parseOrigins(process.env.CORS_ORIGINS).length === 0) {
    throw new Error('CORS_ORIGINS is required in production');
  }
  if (
    process.env.LICENSE_REQUIRE_CENTRAL === 'true' &&
    !process.env.LICENSE_DATABASE?.trim()
  ) {
    throw new Error('LICENSE_DATABASE is required when LICENSE_REQUIRE_CENTRAL=true');
  }
  if (
    process.env.LICENSE_REQUIRE_CENTRAL === 'true' &&
    !process.env.LICENSE_INSTANCE_ID?.trim()
  ) {
    throw new Error('LICENSE_INSTANCE_ID is required when LICENSE_REQUIRE_CENTRAL=true');
  }
};

module.exports = {
  isProduction: process.env.NODE_ENV === 'production',
  parseOrigins,
  validateEnvironment,
};
