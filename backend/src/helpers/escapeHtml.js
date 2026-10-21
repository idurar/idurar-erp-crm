const escapeHtml = (value = '') =>
  String(value).replace(/[&<>'"]/g, (character) => {
    const entities = { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' };
    return entities[character];
  });

module.exports = escapeHtml;
