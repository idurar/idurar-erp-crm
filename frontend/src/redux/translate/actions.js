import * as actionTypes from './types';

import translation from '@/locale/translation';
import languages from '@/locale/languages';

export const translateAction = {
  resetState: () => (dispatch) => {
    dispatch({
      type: actionTypes.RESET_STATE,
    });
  },
  translate: (value) => async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });

    let data = translation[value];
    const isRtl = languages.find((l) => l.value === value).isRtl || false;
    const LANG_STATE = {
      result: data,
      isRtl: isRtl,
      langCode: value,
      isLoading: false,
      isSuccess: false,
    };
    window.localStorage.setItem('translate', JSON.stringify(LANG_STATE));
    if (data) {
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data,
        langCode: value,
        isRtl: isRtl,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  },
};
