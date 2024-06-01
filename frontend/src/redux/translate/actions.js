import * as actionTypes from './types';

import translation from '@/locale/translation/translation';

export const translateAction = {
  resetState: () => (dispatch) => {
    dispatch({
      type: actionTypes.RESET_STATE,
    });
  },
  translate:
    (value = 'en_us') =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
      });

      let data = translation.en_us;
      if (data) {
        const LANG_STATE = {
          result: data,
          isRtl: isRtl,
          langDirection: 'ltr',
          langCode: value,
          isLoading: false,
          isSuccess: false,
        };
        window.localStorage.setItem('translate', JSON.stringify(LANG_STATE));
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
