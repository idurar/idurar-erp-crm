import { API_BASE_URL } from "@/config/serverApiConfig";

import axios from "axios";
import errorHandler from "@/request/errorHandler";

export const login = async (loginAdminData) => {
  try {
    const response = await fetch(
      API_BASE_URL + `login?timestamp=${new Date().getTime()}`,
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cache
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(loginAdminData), // body data type must match "Content-Type" header
      }
    );

    const data = await response.json();

    return data;
  } catch (error) {
    return errorHandler(error);
  }
};
export const logout = async () => {
  axios.defaults.withCredentials = true;
  try {
    window.localStorage.clear();
    await axios.post(API_BASE_URL + `logout?timestamp=${new Date().getTime()}`);
  } catch (error) {
    return errorHandler(error);
  }
};
