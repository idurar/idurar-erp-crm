import * as actionTypes from './types';
import { request } from '@/request';

import fr_fr from '@/lang/fr_fr';

export const langAction = {
  resetState: () => (dispatch) => {
    dispatch({
      type: actionTypes.RESET_STATE,
    });
  },
  translate: () => async (dispatch) => {
    console.log('🚀 ~ file: actions.js:13 ~ dispatch: ~ translate:');
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    let data = fr_fr;
    console.log('🚀 ~ file: actions.js:19 ~ fr_fr:', data);

    if (data) {
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data,
        langCode: 'fr_FR',
      });
      window.localStorage.setItem('lang', JSON.stringify(data));
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  },
};
