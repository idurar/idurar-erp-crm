import * as actionTypes from './types';
import lang from '@/lang/en_us';
import storePersist from '../storePersist';

const INITIAL_LANG_STATE = {
  ...lang,
};

const LANG_INITIAL_STATE = {
  result: INITIAL_LANG_STATE,
  langCode: 'en_us',
  isLoading: false,
  isSuccess: false,
};

const INITIAL_STATE = storePersist.get('translate')
  ? storePersist.get('translate')
  : LANG_INITIAL_STATE;

const langReducer = (state = INITIAL_STATE, action) => {
  const { payload = null, langCode } = action;
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
        result: { ...state.result, ...payload },
        langCode: langCode.toLowerCase(),
        isLoading: false,
        isSuccess: true,
      };
    default:
      return state;
  }
};

export default langReducer;
