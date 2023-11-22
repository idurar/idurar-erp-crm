import * as actionTypes from './types';
import * as authService from '@/auth';
import { request } from '@/request';

export const login =
  ({ loginData }) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
    });
    const data = await authService.login({ loginData });

    if (data.success === true) {
      window.localStorage.setItem('isLoggedIn', true);
      const auth_state = {
        current: data.result,
        isLoggedIn: true,
        isLoading: false,
        isSuccess: true,
      };
      window.localStorage.setItem('auth', JSON.stringify(auth_state));
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data.result,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
      });
    }
  };

export const logout = () => async (dispatch) => {
  authService.logout();
  dispatch({
    type: actionTypes.LOGOUT_SUCCESS,
  });
};

export const updateProfile =
  ({ entity, id, jsonData }) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.REQUEST_LOADING,
      payload: null,
    });

    let data = await request.updateAndUpload({ entity, id, jsonData });

    if (data.success === true) {
      window.localStorage.setItem('auth', JSON.stringify(data.result));
      dispatch({
        type: actionTypes.REQUEST_SUCCESS,
        payload: data.result,
      });
    } else {
      dispatch({
        type: actionTypes.REQUEST_FAILED,
        payload: null,
      });
    }
  };

export const register =
  ({ registerData }) =>
  async (dispatch) => {
    dispatch({
      type: actionTypes.LOADING_REQUEST,
      payload: { loading: true },
    });
    const data = await authService.register({ registerData });
    if (data.success === true) {
      window.localStorage.setItem('isLoggedIn', true);
      window.localStorage.setItem('auth', JSON.stringify(data.result.admin));
      dispatch({
        type: actionTypes.REGISTER_SUCCESS,
        payload: data.result.admin,
      });
    } else {
      dispatch({
        type: actionTypes.FAILED_REQUEST,
        payload: data,
      });
    }
  };
