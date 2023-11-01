import * as actionTypes from './types';
import { request } from '@/request';

import en_us from '@/locale/translation/en_us';
import fr_fr from '@/locale/translation/fr_fr';
import zh_cn from '@/locale/translation/zh_cn';
import ar_eg from '@/locale/translation/ar_eg';
import it_it from '@/locale/translation/it_it';
import ro_ro from '@/locale/translation/ro_ro';

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

    let data = null;

    if (value === 'zh_cn') {
      data = zh_cn;
    } else if (value === 'fr_fr') {
      data = fr_fr;
    } else if (value === 'ro_ro') {
      data = ro_ro;
    } else if (value === 'ar_eg') {
      data = ar_eg;
    } else if (value === 'it_it') {
      data = it_it;
    } else {
      data = en_us;
    }

    const LANG_STATE = {
      result: data,
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
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  },
};
