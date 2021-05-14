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
    collapsedBox: {
      open: () => {
        dispatch({ type: actionTypes.OPEN_BOX });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_BOX });
      },
      collapse: () => {
        dispatch({ type: actionTypes.COLLAPSE_BOX });
      },
    },
  };
};

export default contextActions;
