import * as actionTypes from './types';

const INITIAL_STATE = {
  current: {},
  isLoggedIn: false,
  isLoading: false,
  isSuccess: false,
  error: null, // added to track login errors
};

const authReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.REQUEST_LOADING:
      return {
        ...state,
        isLoading: true,
        isSuccess: false,
        error: null, // reset error on new request
      };

    case actionTypes.REQUEST_FAILED:
      return {
        ...state,
        isLoading: false,
        isSuccess: false,
        isLoggedIn: false,
        error: action.payload || 'Request failed', // store the error message
      };

    case actionTypes.REQUEST_SUCCESS:
      return {
        ...state,
        current: action.payload,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
        error: null, // clear error on success
      };

    case actionTypes.REGISTER_SUCCESS:
      return {
        ...state,
        current: null,
        isLoggedIn: false,
        isLoading: false,
        isSuccess: true,
        error: null,
      };

    case actionTypes.LOGOUT_SUCCESS:
      return INITIAL_STATE;

    case actionTypes.LOGOUT_FAILED:
      return {
        ...state,
        current: action.payload,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
        error: null,
      };

    default:
      return state;
  }
};

export default authReducer;
