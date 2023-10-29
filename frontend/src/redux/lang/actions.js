import * as actionTypes from './types';
import { request } from '@/request';

import en_us from '@/lang/en_us';
import fr_fr from '@/lang/fr_fr';
import zh_cn from '@/lang/zh_cn';
import ar_eg from '@/lang/ar_eg';

export const langAction = {
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
    } else if (value === 'ar_eg') {
      data = ar_eg;
    } else {
      data = en_us;
    }
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
