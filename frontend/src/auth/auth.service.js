import { API_BASE_URL, ACCESS_TOKEN_NAME } from "@/config/serverApiConfig";
import Cookies from "js-cookie";

import axios from "axios";
import errorHandler from "@/request/errorHandler";
import successHandler from "@/request/successHandler";
import storePersist from "@/redux/storePersist";

import { getCookie, setCookie, deleteCookie } from "./cookie";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  withCredentials: true,
  headers: {
    // "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,PUT,POST,DELETE,PATCH,OPTIONS",
    mode: "no-cors",
  },
});
// export const login = async (loginAdminData) => {
//   axios.defaults.withCredentials = true;
//   try {
//     const response = await axios.post(
//       API_BASE_URL + `login?timestamp=${new Date().getTime()}`,
//       loginAdminData
//     );
//     console.log("🚀 ~ file: auth.service.js ~ line 16 ~ login", response);
//     token.set(response.data.result.token);
//     return successHandler(response);
//   } catch (error) {
//     return errorHandler(error);
//   }
// };

export const login = async (loginAdminData) => {
  try {
    // const response = await axios.post(
    //   API_BASE_URL + `login?timestamp=${new Date().getTime()}`,
    //   loginAdminData
    // );
    const response = await fetch(
      API_BASE_URL + `login?timestamp=${new Date().getTime()}`,
      {
        method: "POST", // *GET, POST, PUT, DELETE, etc.
        mode: "cors", // no-cors, *cors, same-origin
        cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
        credentials: "same-origin", // include, *same-origin, omit
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        redirect: "follow", // manual, *follow, error
        referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: JSON.stringify(loginAdminData), // body data type must match "Content-Type" header
      }
    );
    // response.then((resp) => {
    //   console.log("🚀 ~ file: auth.service.js ~ line 60 ~ login ~ resp", resp);
    //   console.log(
    //     "🚀 ~ file: auth.service.js ~ line 60 ~ login ~ resp : set-cookie :",
    //     resp.headers.get("set-cookie")
    //   );
    // });
    const resp = await response;
    console.log("🚀 ~ file: auth.service.js ~ line 16 ~ resp", resp);
    // console.log("🚀 ~ file: auth.service.js ~ line 16 ~ resp parse", resp);
    const data = await response.json();
    console.log("🚀 ~ file: auth.service.js ~ line 16 ~ login", data);
    Cookies.set("token", data.result.token, { expires: 365 });
    console.log(
      "🚀 ~ file: auth.service.js ~ line 16 ~ Cookies.get",
      Cookies.get()
    );
    token.set(data.result.token);
    return data;
  } catch (error) {
    return errorHandler(error);
  }
};
export const logout = () => {
  token.remove();
  storePersist.clear();
};

export const token = {
  get: () => {
    return getCookie(ACCESS_TOKEN_NAME);
  },
  set: (token) => {
    return setCookie(ACCESS_TOKEN_NAME, token);
  },
  remove: () => {
    return deleteCookie(ACCESS_TOKEN_NAME);
  },
};
