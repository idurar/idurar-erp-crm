import * as actionTypes from "./types";
import * as authService from "../../auth";
import storePersist from "../storePersist";

export const login = ({ loginUserData }) => async (dispatch) => {
  dispatch({
    type: actionTypes.LOADING_REQUEST,
    payload: { loading: true },
  });
  const ajaxCall = authService.login({ loginUserData });
  ajaxCall.then(function (data) {
    if (data.success === true) {
      const authValue = {
        current: data.result.user,
        loading: false,
        isLoggedIn: true,
      };
      storePersist.set("auth", authValue);
      dispatch({
        type: actionTypes.LOGIN_SUCCESS,
        payload: data.result.user,
      });
    } else {
      dispatch({
        type: actionTypes.FAILED_REQUEST,
        payload: data,
      });
    }
  });
};

export const logout = () => async (dispatch) => {
  authService.logout();
  storePersist.clear();
  dispatch({
    type: actionTypes.LOGOUT_SUCCESS,
  });
};
