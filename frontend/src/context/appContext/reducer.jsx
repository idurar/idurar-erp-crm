import * as actionTypes from './types';

export const initialState = {
  isNavMenuClose: false,
  isMobile: false,
};

export function contextReducer(state, action) {
  switch (action.type) {
    case actionTypes.OPEN_NAV_MENU:
      return {
        ...state,
        isNavMenuClose: false,
      };
    case actionTypes.CLOSE_NAV_MENU:
      return {
        ...state,
        isNavMenuClose: true,
      };
    case actionTypes.COLLAPSE_NAV_MENU:
      return {
        ...state,
        isNavMenuClose: !state.isNavMenuClose,
      };

    case actionTypes.SET_MOBILE_SIZE:
      return {
        ...state,
        isMobile: action.payload.isMobile,
      };

    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
