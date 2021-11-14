import * as actionTypes from "./types";

const INITIAL_STATE = {
  currency: "DA",
  currencyPosition: "after",
};

const authReducer = (state = INITIAL_STATE, action) => {
  const { payload, keyState } = action;
  switch (action.type) {
    case actionTypes.SET_STATE:
      return {
        ...state,
        [keyState]: payload,
      };

    default:
      return state;
  }
};

export default authReducer;
