import * as actionTypes from './types';
import { request } from '@/request';

export const currencyAction = {
  resetState: () => (dispatch) => {
    dispatch({
      type: actionTypes.RESET_STATE,
    });
  },
  updateCurrency:
    ({ data }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.UPDATE_CURRENCY,
        payload: data,
      });
    },
  list: () => async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });

    let data = await request.listAll({ entity: 'currency', options: { enabled: true } });

    if (data.success === true) {
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data.result,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  },
};
