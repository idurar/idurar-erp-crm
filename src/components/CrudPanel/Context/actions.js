import * as actionTypes from "./types";

const contextAction = (dispatch) => {
  return {
    increment: () => {
      dispatch({ type: "increment" });
    },
  };
};

export default contextAction;
