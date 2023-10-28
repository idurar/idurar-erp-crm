import { useSelector } from 'react-redux';
import { selectCurrentLang } from '@/redux/lang/selectors';
import getLabel from '@/lang/getLabel';

const useLanguage = () => {
  const lang = useSelector(selectCurrentLang);

  const getLang = (value) => getLabel(lang, value);

  return getLang;
};

export default useLanguage;
