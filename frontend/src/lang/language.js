import store from '@/redux/store';

const getLanguage = () => {
  const result = store.getState().lang.result;
  return result;
};

const lang = getLanguage();
export default lang;
