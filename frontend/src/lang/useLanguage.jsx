import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';

const getLabel = (lang, key) => {
  const lowerCaseKey = key.toLowerCase().replace(/ /g, '_');

  if (lang[lowerCaseKey]) return lang[lowerCaseKey];
  else {
    // convert no found language label key to label
    const remove_underscore_fromKey = lowerCaseKey.replace(/_/g, ' ').split(' ');

    const conversionOfAllFirstCharacterofEachWord = remove_underscore_fromKey.map(
      (word) => word[0].toUpperCase() + word.substring(1)
    );

    const label = conversionOfAllFirstCharacterofEachWord.join(' ');
    console.error(
      '🇩🇿 🇧🇷 🇻🇳 🇮🇩 🇨🇳 Language Label Warning : translate("' +
        lowerCaseKey +
        '") failed to get label for this key : ' +
        lowerCaseKey +
        ' please review your language config file and add this label'
    );
    return label;
  }
};

const useLanguage = () => {
  const lang = useSelector(selectCurrentLang);

  const translate = (value) => getLabel(lang, value);

  return translate;
};

export default useLanguage;
