import * as actionTypes from "./types";

export const initialState = {
  isModalOpen: false,
  isAdvancedModalOpen: false,
  isPanelCollapsed: false,
  isBoxCollapsed: false,
  isReadBoxOpen: true,
};

export function contextReducer(state, action) {
  switch (action.type) {
    case actionTypes.OPEN_MODAL:
      return {
        ...state,
        isAdvancedModalOpen: false,
        isModalOpen: true,
      };
    case actionTypes.CLOSE_MODAL:
      return {
        ...state,
        isModalOpen: false,
      };
    case actionTypes.OPEN_ADVANCED_MODAL:
      return {
        ...state,
        isModalOpen: false,
        isAdvancedModalOpen: true,
      };
    case actionTypes.CLOSE_ADVANCED_MODAL:
      return {
        ...state,
        isAdvancedModalOpen: false,
      };
    case actionTypes.OPEN_PANEL:
      return {
        ...state,
        isPanelCollapsed: false,
      };
    case actionTypes.CLOSE_PANEL:
      return {
        ...state,
        isPanelCollapsed: true,
      };
    case actionTypes.COLLAPSE_PANEL:
      return {
        ...state,
        isPanelCollapsed: !state.isPanelCollapsed,
      };
    case actionTypes.OPEN_BOX:
      return {
        ...state,
        isBoxCollapsed: true,
      };
    case actionTypes.CLOSE_BOX:
      return {
        ...state,
        isBoxCollapsed: false,
      };
    case actionTypes.COLLAPSE_BOX:
      return {
        ...state,
        isBoxCollapsed: !state.isBoxCollapsed,
      };
    case actionTypes.OPEN_READ_BOX:
      return {
        ...state,
        isReadBoxOpen: true,
      };
    case actionTypes.CLOSE_READ_BOX:
      return {
        ...state,
        isReadBoxOpen: false,
      };
    case actionTypes.COLLAPSE_READ_BOX:
      return {
        ...state,
        isReadBoxOpen: !state.isReadBoxOpen,
      };
    default: {
      throw new Error(`Unhandled action type: ${action.type}`);
    }
  }
}
