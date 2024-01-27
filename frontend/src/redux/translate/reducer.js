import * as actionTypes from './types';
import en_us from '@/locale/translation/en_us';
import storePersist from '../storePersist';

const LANG_INITIAL_STATE = {
  result: en_us,
  langCode: 'en_us',
  langDirection: 'ltr',
  isLoading: false,
  isSuccess: false,
};

const INITIAL_STATE = storePersist.get('translate')
  ? storePersist.get('translate')
  : LANG_INITIAL_STATE;

const translateReducer = (state = INITIAL_STATE, action) => {
  const { payload = null, langCode, isRtl = false } = action;
  switch (action.type) {
    case actionTypes.RESET_STATE:
      return INITIAL_STATE;
    case actionTypes.REQUEST_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.REQUEST_FAILED:
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
      };

    case actionTypes.REQUEST_SUCCESS:
      return {
        result: payload,
        langCode: langCode.toLowerCase(),
        langDirection: isRtl ? 'rtl' : 'ltr',
        isLoading: false,
        isSuccess: true,
      };
    default:
      return state;
  }
};

export default translateReducer;
