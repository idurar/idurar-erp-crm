import * as actionTypes from './types';

const INITIAL_STATE = {
  current: {},
  isLoggedIn: false,
  isLoading: false,
  isSuccess: false,
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.REQUEST_LOADING:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.REQUEST_FAILED:
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
      };

    case actionTypes.REQUEST_SUCCESS:
      return {
        current: action.payload,
        isLoading: false,
        isLoggedIn: true,
        isSuccess: true,
      };
    case actionTypes.LOGOUT_SUCCESS:
      return INITIAL_STATE;

    default:
      return state;
  }
};

export default authReducer;
