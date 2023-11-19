import * as actionTypes from './types';

import languages from '@/locale/languages';

async function fetchTranslation() {
  try {
    let translation = await import('@/locale/translation/translation');
    return translation.default;
  } catch (error) {
    console.error(
      'Error fetching translation file :~ file: actions.js:7 ~ fetchTranslation ~ fetchTranslation:',
      error
    );
  }
}

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
    const translation = await fetchTranslation();
    let data = await translation[value];

    const isRtl = languages.find((l) => l.value === value).isRtl || false;
    const LANG_STATE = {
      result: data,
      isRtl: isRtl,
      langDirection: isRtl ? 'rtl' : 'ltr',
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
