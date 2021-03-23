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
  let loginRes = null;
  try {
    loginRes = await Axios.post(API_BASE_URL + `login`, loginUser);
    setUserData({
      token: loginRes.data.result.token,
      user: loginRes.data.result.user,
    });
    localStorage.setItem(ACCESS_TOKEN_NAME, loginRes.data.result.token);
    history.push("/");
  } catch (err) {
    console.log(err.response);
    err.response.data.message && setError(err.response.data.message);
  }
};
