import * as actionTypes from './types';

export const initialState = {
  isModalOpen: false,
  isPanelClose: true,
  isBoxCollapsed: false,
  isReadBoxOpen: false,
  isAdvancedBoxOpen: false,
  isEditBoxOpen: false,
};

export function contextReducer(state, action) {
  switch (action.type) {
    case actionTypes.OPEN_MODAL:
      return {
        ...state,
        isModalOpen: true,
      };
    case actionTypes.CLOSE_MODAL:
      return {
        ...state,
        isModalOpen: false,
      };

    case actionTypes.OPEN_PANEL:
      return {
        ...state,
        isPanelClose: false,
      };
    case actionTypes.CLOSE_PANEL:
      return {
        ...state,
        isPanelClose: true,
      };
    case actionTypes.COLLAPSE_PANEL:
      return {
        ...state,
        isPanelClose: !state.isPanelClose,
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
        isAdvancedBoxOpen: false,
        isEditBoxOpen: false,
        isReadBoxOpen: true,
      };
    case actionTypes.CLOSE_READ_BOX:
      return {
        ...state,
        isReadBoxOpen: false,
      };
    case actionTypes.OPEN_ADVANCED_BOX:
      return {
        ...state,
        isReadBoxOpen: false,
        isEditBoxOpen: false,
        isAdvancedBoxOpen: true,
      };
    case actionTypes.CLOSE_ADVANCED_BOX:
      return {
        ...state,
        isAdvancedBoxOpen: false,
      };
    case actionTypes.OPEN_EDIT_BOX:
      return {
        ...state,
        isReadBoxOpen: false,
        isAdvancedBoxOpen: false,
        isEditBoxOpen: true,
      };
    case actionTypes.CLOSE_EDIT_BOX:
      return {
        ...state,
        isEditBoxOpen: false,
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
