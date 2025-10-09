function checkAndCorrectURL(url) {
  // detect if it has http or https:
  const hasHttps = url.startsWith('https://');

  // Remove "http://" or "https://" if present
  url = url.replace(/^https?:\/\//i, '');

  // Remove trailing slashes
  url = url.replace(/\/+$/, '');

  const httpType = hasHttps ? 'https://' : 'http://';
  return httpType + url;
}

module.exports = checkAndCorrectURL;
