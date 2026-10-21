const escapeRegex = (value = '') => String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const isSafeField = (field = '') =>
  /^[A-Za-z][A-Za-z0-9_.]*$/.test(field) && !String(field).split('.').includes('__proto__');

module.exports = { escapeRegex, isSafeField };
