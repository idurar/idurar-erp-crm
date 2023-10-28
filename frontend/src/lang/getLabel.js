export const getLabel = (lang, key) => {
  const lowerCaseKey = key.toLowerCase().replace(/ /g, '_');

  if (lang[lowerCaseKey]) return lang[lowerCaseKey];
  else {
    // convert no found language label key to label
    const remove_underscore_fromKey = lowerCaseKey.replace(/_/g, ' ').split(' ');

    const conversionOfAllFirstCharacterofEachWord = remove_underscore_fromKey.map(
      (word) => word[0].toUpperCase() + word.substring(1)
    );

    const label = conversionOfAllFirstCharacterofEachWord.join(' ');
    // console.error(
    //   'Language Label Warning : getLang("' +
    //     key +
    //     '") failed to get label for this key : ' +
    //     key +
    //     ' please review your language config file and add this label'
    // );
    return label;
  }
};

export default getLabel;
