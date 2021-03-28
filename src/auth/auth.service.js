import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../config/serverApiConfig";
import Cookies from "js-cookie";
import Axios from "axios";
import errorHandler from "../axiosRequest/errorHandler";
import successHandler from "../axiosRequest/successHandler";

export const token = {
  get: () => {
    return Cookies.get(ACCESS_TOKEN_NAME);
  },

  set: (token) => {
    return Cookies.set(ACCESS_TOKEN_NAME, token);
  },

  remove: () => {
    return Cookies.remove(ACCESS_TOKEN_NAME);
  },
};

export const login = async ({ loginUserData }) => {
  result = await Axios.post(API_BASE_URL + `login`, loginUserData)
    .then((response) => {
      token.set(loginRes.data.result.token);
      return successHandler(response);
    })
    .catch(function (error) {
      return errorHandler(error);
    })
    .finally(function () {});
  return result;
};

export const logout = () => {
  token.remove();
};
