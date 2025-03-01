const { readBySettingKey } = require('@/middlewares/settings');

const getLabel = (lang, key) => {
  try {
    const lowerCaseKey = key
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, '_')
      .replace(/ /g, '_');

    if (lang[lowerCaseKey]) return lang[lowerCaseKey];
    else {
      const remove_underscore_fromKey = lowerCaseKey.replace(/_/g, ' ').split(' ');

      const conversionOfAllFirstCharacterofEachWord = remove_underscore_fromKey.map(
        (word) => word[0].toUpperCase() + word.substring(1)
      );

      const label = conversionOfAllFirstCharacterofEachWord.join(' ');

      return label;
    }
  } catch (error) {
    return 'No translate Found';
  }
};

const useSelector = () => {
  const defaultfilePath = `./translation/en_us`;

  const langFile = require(defaultfilePath);
  return langFile;
};

const useLanguage = ({ selectedLang }) => {
  const lang = useSelector();
  const translate = (value) => {
    const text = getLabel(lang, value);
    return text;
  };
  return translate;
};

module.exports = useLanguage;
