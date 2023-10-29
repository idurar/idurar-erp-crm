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
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    let data = fr_fr;

    if (data) {
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data,
        langCode: 'fr_FR',
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  },
};
