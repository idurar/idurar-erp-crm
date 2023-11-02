import * as actionTypes from './types';

export const initialState = {
  isNavMenuClose: false,
};

export function contextReducer(state, action) {
  switch (action.type) {
    case actionTypes.OPEN_NAV_MENU:
      return {
        isNavMenuClose: false,
      };
    case actionTypes.CLOSE_NAV_MENU:
      return {
        isNavMenuClose: true,
      };
    case actionTypes.COLLAPSE_NAV_MENU:
      return {
        isNavMenuClose: !state.isNavMenuClose,
      };

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
