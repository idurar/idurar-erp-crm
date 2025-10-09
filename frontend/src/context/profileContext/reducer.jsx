import * as actionTypes from './types';

export const initialState = {
  read: {
    isOpen: true,
  },
  update: {
    isOpen: false,
  },
  passwordModal: {
    isOpen: false,
  },
};

export function contextReducer(state, action) {
  const { keyState = null } = action;
  switch (action.type) {
    case actionTypes.OPEN_MODAL:
      return {
        ...state,
        passwordModal: { isOpen: true },
      };
    case actionTypes.CLOSE_MODAL:
      return {
        ...state,
        passwordModal: { isOpen: false },
      };
    case actionTypes.OPEN_PANEL:
      return {
        ...initialState,
        read: {
          isOpen: false,
        },
        [keyState]: { isOpen: true },
      };
    case actionTypes.CLOSE_PANEL:
      return {
        ...initialState,
      };

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
