import * as actionTypes from './types';

const INITIAL_STATE = {};

const notifyReducer = (state = INITIAL_STATE, action) => {
  const { payload } = action;
  switch (action.type) {
    case actionTypes.START_LOADING:
      return {
        ...state,
        [payload.actionName]: {
          ...state[payload.actionName],
          loading: true,
        },
      };
    case actionTypes.FINISH_LOADING:
      return {
        ...state,
        [payload.actionName]: {
          ...state[payload.actionName],
          loading: false,
        },
      };
    case actionTypes.UPDATE_UI:
      return {
        ...state,
        [payload.actionName]: {
          ...state[payload.actionName],
          ...payload.ActionProps,
        },
      };
    default:
      return state;
  }
};

export default notifyReducer;
