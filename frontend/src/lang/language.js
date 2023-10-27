import store from '@/redux/store';

const getLanguage = () => {
  const result = store.getState().lang.result;
  console.log('🚀 ~ file: language.js:5 ~ lang ~ result:', result);
  return result;
};

const lang = getLanguage();
export default lang;
