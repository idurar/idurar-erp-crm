import * as actionTypes from "./types";
import { request } from "@/request";

export const search = {
  init: (list) => async (dispatch) => {
    dispatch({
      type: actionTypes.INIT_STATE,
      payload: list,
    });
  },
  resetState: () => async (dispatch) => {
    dispatch({
      type: actionTypes.RESET_STATE,
    });
  },
  resetRef: (keyRef) => async (dispatch) => {
    dispatch({
      type: actionTypes.RESET_REF,
      keyState: keyRef,
    });
  },

  selected: (keyRef, data) => async (dispatch) => {
    dispatch({
      type: actionTypes.CURRENT_SELECTED,
      keyState: keyRef,
      payload: data,
    });
  },

  list: (entity, keyRef, source, option) => async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
      keyState: keyRef,
    });

    source.cancel();
    source = request.source();
    let data = await request.search(entity, source, option);

    if (data.success === true) {
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        keyState: keyRef,
        payload: data.result,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
        keyState: keyRef,
      });
    }
  },
};
