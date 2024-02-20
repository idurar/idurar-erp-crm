import * as actionTypes from './types';

import languages from '@/locale/languages';
import coreTranslation from '@/locale/coreTranslation';

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
async function fetchOtherTranslation() {
  try {
    let otherTranslation = await import('@/locale/translation/otherTranslation');
    return otherTranslation.default;
  } catch (error) {
    console.error(
      'Error fetching otherTranslation file :~ file: actions.js:16 ~ fetchTranslation ~ fetchTranslation:',
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
  translate:
    (value = 'en_us') =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
      });

      let translation;
      if (coreTranslation.includes(value.toLowerCase())) {
        translation = await fetchTranslation();
      } else {
        translation = await fetchOtherTranslation();
      }

      let data = await translation[value];
      if (data) {
        const isRtl = languages.find((l) => l.value === value)?.isRtl || false;
        const LANG_STATE = {
          result: data,
          isRtl: isRtl,
          langDirection: isRtl ? 'rtl' : 'ltr',
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
