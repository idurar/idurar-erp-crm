import * as actionTypes from './types';

export const startLoading = (actionName) => async (dispatch) => {
  dispatch({
    type: actionTypes.START_LOADING,
    payload: actionName,
  });
};

export const finishLoading = (actionName) => async (dispatch) => {
  dispatch({
    type: actionTypes.FINISH_LOADING,
    payload: actionName,
  });
};
