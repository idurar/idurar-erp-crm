import * as actionTypes from './types';

const INITIAL_STATE = {
  current: {},
  loading: false,
  isLoggedIn: false,
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.LOADING_REQUEST:
      return {
        ...state,
        loading: true,
      };
    case actionTypes.FAILED_REQUEST:
      return INITIAL_STATE;

    case actionTypes.LOGIN_SUCCESS:
      return {
        current: action.payload,
        loading: false,
        isLoggedIn: true,
      };
    case actionTypes.LOGOUT_SUCCESS:
      return INITIAL_STATE;

    default:
      return state;
  }
};

export default authReducer;
