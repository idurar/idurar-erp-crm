import * as actionTypes from './types';

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
    updatePanel: {
      open: () => {
        dispatch({ type: actionTypes.OPEN_PANEL, keyState: 'update' });
      },
      close: () => {
        dispatch({ type: actionTypes.CLOSE_PANEL });
      },
    },
  };
};

export default contextActions;
