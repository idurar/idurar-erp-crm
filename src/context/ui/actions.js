import * as actionTypes from "./types";

const contextActions = (dispatch) => {
  return {
    modal: {
      open: () => {
        dispatch({ type: actionTypes.OPEN_MODAL });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_MODAL });
      },
    },
    panel: {
      open: () => {
        dispatch({ type: actionTypes.OPEN_PANEL });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_PANEL });
      },
      collapse: () => {
        dispatch({ type: actionTypes.COLLAPSE_PANEL });
      },
    },
    accordion: {
      open: () => {
        dispatch({ type: actionTypes.OPEN_ACCORDION });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_ACCORDION });
      },
      collapse: () => {
        dispatch({ type: actionTypes.COLLAPSE_ACCORDION });
      },
    },
  };
};

export default contextActions;
