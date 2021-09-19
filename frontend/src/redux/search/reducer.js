import * as actionTypes from "./types";

const INITIAL_REF_STATE = {
  result: [],
  selected: null,
  isLoading: false,
  isSuccess: false,
};
const INITIAL_STATE = {};

const searchReducer = (state = INITIAL_STATE, action) => {
  const { payload = null, keyState = null } = action;
  switch (action.type) {
    case actionTypes.INIT_STATE: {
      let newState = {};
      payload.map((refKey) => (newState[refKey] = INITIAL_REF_STATE));
      return newState;
    }

    case actionTypes.RESET_STATE:
      return INITIAL_STATE;

    case actionTypes.RESET_REF:
      return {
        ...state,
        [keyState]: INITIAL_REF_STATE,
      };

    case actionTypes.CURRENT_SELECTED:
      return {
        ...state,
        [keyState]: {
          ...state[keyState],
          selected: payload,
        },
      };
    case actionTypes.REQUEST_LOADING:
      return {
        ...state,
        [keyState]: {
          ...INITIAL_REF_STATE,
          isLoading: true,
        },
      };
    case actionTypes.REQUEST_FAILED:
      return {
        ...state,
        [keyState]: INITIAL_REF_STATE,
      };
    case actionTypes.REQUEST_SUCCESS:
      return {
        ...state,
        [keyState]: {
          ...INITIAL_REF_STATE,
          result: payload,
          isSuccess: true,
        },
      };

    default:
      return state;
  }
};

export default searchReducer;
