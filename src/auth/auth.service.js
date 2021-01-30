import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../config/serverApiConfig";
import { useHistory } from "react-router-dom";
import Axios from "axios";
export function logout(setUserData) {
  localStorage.removeItem(ACCESS_TOKEN_NAME);
  setUserData({
    token: undefined,
    user: undefined,
  });
}
export const login = async (loginUser, setUserData, setError, history) => {
  try {
    const loginRes = await Axios.post(API_BASE_URL + `login`, loginUser);
    setUserData({
      token: loginRes.data.token,
      user: loginRes.data.user,
    });
    localStorage.setItem(ACCESS_TOKEN_NAME, loginRes.data.token);
    history.push("/");
  } catch (err) {
    console.log(err.response.data);
    err.response.data.error && setError(err.response.data.error);
  }
};
