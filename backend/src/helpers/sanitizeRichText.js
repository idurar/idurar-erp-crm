const ALLOWED_TAGS = 'p|br|strong|em|b|i|u|ul|ol|li';

const sanitizeRichText = (html = '') =>
  String(html)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(
      new RegExp(`&lt;(/?)(${ALLOWED_TAGS})\\s*/?&gt;`, 'gi'),
      (_match, closing, tag) => `<${closing}${tag.toLowerCase()}>`
    );

module.exports = sanitizeRichText;
