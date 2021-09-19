import * as actionTypes from "./types";
import * as authService from "@/auth";
import storePersist from "@/redux/storePersist";
import history from "@/utils/history";

export const login = (loginAdminData) => async (dispatch) => {
  dispatch({
    type: actionTypes.LOADING_REQUEST,
    payload: { loading: true },
  });
  const data = await authService.login(loginAdminData);

  if (data.success === true) {
    const authValue = {
      current: data.result.admin,
      loading: false,
      isLoggedIn: true,
    };
    storePersist.set("auth", authValue);
    dispatch({
      type: actionTypes.LOGIN_SUCCESS,
      payload: data.result.admin,
    });
    history.push("/");
  } else {
    dispatch({
      type: actionTypes.FAILED_REQUEST,
      payload: data,
    });
  }
};

export const logout = () => async (dispatch) => {
  authService.logout();
  dispatch({
    type: actionTypes.LOGOUT_SUCCESS,
  });
  history.push("/login");
};
