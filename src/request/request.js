import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "@/config/serverApiConfig";
import { token as tokenCookies } from "@/auth";
import errorHandler from "./errorHandler";
import successHandler from "./successHandler";

const headersInstance = { [ACCESS_TOKEN_NAME]: tokenCookies.get() };

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: headersInstance,
});
// let isConnected = true;
// window.onoffline = (event) => {
//   isConnected = false;
// };

const request = {
  create: async (entity, jsonData, option = {}) => {
    axiosInstance.defaults.headers = headersInstance;
    try {
      const response = await axiosInstance.post(entity + "/create", jsonData);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
  read: async (entity, id, option = {}) => {
    axiosInstance.defaults.headers = headersInstance;
    try {
      const response = await axiosInstance.get(entity + "/read/" + id);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
  update: async (entity, id, jsonData, option = {}) => {
    axiosInstance.defaults.headers = headersInstance;
    try {
      const response = await axiosInstance.patch(
        entity + "/update/" + id,
        jsonData
      );
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  delete: async (entity, id, option = {}) => {
    axiosInstance.defaults.headers = headersInstance;
    try {
      const response = await axiosInstance.delete(entity + "/delete/" + id);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  filter: async (entity, option = {}) => {
    axiosInstance.defaults.headers = headersInstance;
    try {
      let filter = option.filter ? "filter=" + option.filter : "";
      let equal = option.equal ? "&equal=" + option.equal : "";
      let query = `?${filter}${equal}`;

      const response = await axiosInstance.get(entity + "/filter" + query);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  search: async (entity, source, option = {}) => {
    axiosInstance.defaults.headers = {
      [ACCESS_TOKEN_NAME]: tokenCookies.get(),
    };
    try {
      let query = "";
      if (option !== {}) {
        let fields = option.fields ? "fields=" + option.fields : "";
        let question = option.question ? "&q=" + option.question : "";
        query = `?${fields}${question}`;
      }
      // headersInstance.cancelToken = source.token;
      const response = await axiosInstance.get(entity + "/search" + query, {
        cancelToken: source.token,
      });

      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  list: async (entity, option = {}) => {
    axiosInstance.defaults.headers = {
      [ACCESS_TOKEN_NAME]: tokenCookies.get(),
    };
    console.log(tokenCookies.get());
    try {
      let query = "";
      if (option !== {}) {
        let page = option.page ? "page=" + option.page : "";
        let items = option.items ? "&items=" + option.items : "";
        query = `?${page}${items}`;
      }

      const response = await axiosInstance.get(entity + "/list" + query);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  post: async (entityUrl, jsonData, option = {}) => {
    axiosInstance.defaults.headers = headersInstance;
    try {
      const response = await axiosInstance.post(entityUrl, jsonData);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
  get: async (entityUrl, option = {}) => {
    axiosInstance.defaults.headers = headersInstance;
    try {
      const response = await axiosInstance.get(entityUrl);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
  source: () => {
    // const CancelToken = await axiosInstance.CancelToken;

    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    return source;
  },
};
export default request;

// export const searchSync = (target, source, option = {}) => {
//   if (option.loaderWarpper) {
//     loader.init(option.loaderWarpper);
//   }
//   let query = "";
//   if (option !=={}) {
//     let fields = "";
//     let question = "";
//     if (option.fields) {
//       fields = "fields=" + option.fields;
//     }
//     if (option.question) {
//       question = "&q=" + option.question;
//     }
//     query = `?${fields}${question}`;
//   }

//   const result = axios
//     .get(baseUrl + target + "/search" + query, {
//       cancelToken: source.token,
//     })
//     .then((response) => {
//       // returning the data here allows the caller to get it through another .then(...)
//       //console.log(response.data);
//       return response.data;
//     })
//     .catch(function (error) {
//       if (error.response === undefined) {
//         return { success: false };
//       } else {
//         return error.response.data;
//       }
//     })
//     .finally(function () {
//       if (option.loaderWarpper) {
//         loader.remove(option.loaderWarpper);
//       }
//     });

//   return result;
// };
