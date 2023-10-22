import * as actionTypes from './types';
import { request } from '@/request';

export const profileAction = {
  resetState: () => (dispatch) => {
    dispatch({
      type: actionTypes.RESET_STATE,
    });
  },
  currentProfile:
    ({ data }) =>
    (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data,
      });
    },
  update:
    ({ entity, id, jsonData }) =>
    async (dispatch) => {
      dispatch({
        type: actionTypes.REQUEST_LOADING,
        payload: null,
      });

      let data = await request.updateAndUpload({ entity, id, jsonData });

      if (data.success === true) {
        dispatch({
          type: actionTypes.REQUEST_SUCCESS,
          payload: data.result,
        });
      } else {
        dispatch({
          type: actionTypes.REQUEST_FAILED,
          payload: null,
        });
      }
    },
};
