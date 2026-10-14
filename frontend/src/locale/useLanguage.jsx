import languages from './translation/translation';

const language = languages.de_de;

const getLabel = (key) => {
  const normalizedKey = key
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '');

  if (language[normalizedKey]) {
    return language[normalizedKey];
  }

  return key
    .replace(/_/g, ' ')
    .split(' ')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

const useLanguage = () => {
  const translate = (value) => getLabel(value);

  return translate;
};

export default useLanguage;
