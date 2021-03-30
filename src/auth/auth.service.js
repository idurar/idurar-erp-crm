import { API_BASE_URL, ACCESS_TOKEN_NAME } from "@/config/serverApiConfig";
import Cookies from "js-cookie";
import axios from "axios";
import errorHandler from "@/request/errorHandler";
import successHandler from "@/request/successHandler";
import storePersist from "@/redux/storePersist";

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

export const login = async (loginUserData) => {
  try {
    const response = await axios.post(API_BASE_URL + `login`, loginUserData);
    token.set(response.data.result.token);
    return successHandler(response);
  } catch (error) {
    return errorHandler(error);
  }
};

export const logout = () => {
  token.remove();
  storePersist.clear();
};
