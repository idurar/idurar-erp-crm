import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "@/config/serverApiConfig";
import { token as tokenCookies } from "@/auth";
import errorHandler from "./errorHandler";
import successHandler from "./successHandler";

const headersInstance = { [ACCESS_TOKEN_NAME]: tokenCookies.get() };

// const axios = axios.create({
//   baseURL: API_BASE_URL,
//   timeout: 30000,
//   withCredentials: true,
//   // headers: {
//   //   ...headersInstance,
//   // },
// });
axios.defaults.baseURL = API_BASE_URL;
axios.defaults.withCredentials = true;

const request = {
  create: async (entity, jsonData) => {
    console.log(
      "🚀 Create Request 🚀 ~ file: request.js ~ line 19 ~ create: ~ jsonData",
      jsonData
    );
    // axios.defaults.headers = {
    //   ...headersInstance,
    // };
    console.log("jsonData", jsonData);
    try {
      const response = await axios.post(entity + "/create", jsonData);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
  read: async (entity, id) => {
    // axios.defaults.headers = {
    //   ...headersInstance,
    // };
    try {
      const response = await axios.get(entity + "/read/" + id);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
  update: async (entity, id, jsonData) => {
    console.log(
      "🚀 Update Request 🚀 ~ file: request.js ~ line 42 ~ update: ~ jsonData",
      jsonData
    );
    // axios.defaults.headers = {
    //   ...headersInstance,
    // };
    try {
      const response = await axios.patch(entity + "/update/" + id, jsonData);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  delete: async (entity, id, option = {}) => {
    // axios.defaults.headers = {
    //   ...headersInstance,
    // };
    try {
      const response = await axios.delete(entity + "/delete/" + id);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  filter: async (entity, option = {}) => {
    // axios.defaults.headers = {
    //   ...headersInstance,
    // };
    try {
      let filter = option.filter ? "filter=" + option.filter : "";
      let equal = option.equal ? "&equal=" + option.equal : "";
      let query = `?${filter}${equal}`;

      const response = await axios.get(entity + "/filter" + query);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  search: async (entity, source, options = {}) => {
    // axios.defaults.headers = {
    //   [ACCESS_TOKEN_NAME]: tokenCookies.get(),
    // };
    try {
      let query = "?";
      for (var key in options) {
        query += key + "=" + options[key] + "&";
      }
      query = query.slice(0, -1);
      // headersInstance.cancelToken = source.token;
      const response = await axios.get(entity + "/search" + query, {
        cancelToken: source.token,
      });

      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  list: async (entity, options = {}) => {
    // axios.defaults.headers = {
    //   [ACCESS_TOKEN_NAME]: tokenCookies.get(),
    // };

    try {
      let query = "?";
      for (var key in options) {
        query += key + "=" + options[key] + "&";
      }
      query = query.slice(0, -1);

      const response = await axios.get(entity + "/list" + query);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  post: async (entityUrl, jsonData, option = {}) => {
    // axios.defaults.headers = {
    //   ...headersInstance,
    // };
    try {
      const response = await axios.post(entityUrl, jsonData);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
  get: async (entityUrl) => {
    // axios.defaults.headers = {
    //   ...headersInstance,
    // };
    try {
      const response = await axios.get(entityUrl);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
  patch: async (entityUrl, jsonData) => {
    // axios.defaults.headers = {
    //   ...headersInstance,
    // };
    try {
      const response = await axios.patch(entityUrl, jsonData);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  source: () => {
    // const CancelToken = await axios.CancelToken;

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    return source;
  },
};
export default request;
