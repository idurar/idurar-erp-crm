const write = (level, message, meta = {}) => {
  const entry = JSON.stringify({ timestamp: new Date().toISOString(), level, message, ...meta });
  (level === 'error' ? console.error : console.log)(entry);
};

module.exports = {
  info: (message, meta) => write('info', message, meta),
  warn: (message, meta) => write('warn', message, meta),
  error: (message, meta) => write('error', message, meta),
};
