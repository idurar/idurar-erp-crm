import * as actionTypes from './types';

export const settings = {
  currency:
    ({ value = '$' }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.SET_STATE,
        keyState: 'currency',
        payload: value,
      });
    },
  currencyPosition:
    ({ position = true }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.SET_STATE,
        keyState: 'currencyPosition',
        payload: position,
      });
    },
};
