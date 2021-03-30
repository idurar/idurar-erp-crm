import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "@/config/serverApiConfig";
import { token as tokenCookies } from "@/auth";
import errorHandler from "./errorHandler";
import successHandler from "./successHandler";

const headersInstance = { [ACCESS_TOKEN_NAME]: tokenCookies.get() };

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: headersInstance,
});
const request = {
  create: async (target, jsonData, option = {}) => {
    try {
      const response = await axiosInstance.post(target + "/create", jsonData);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
  read: async (target, id, option = {}) => {
    try {
      const response = await axiosInstance.get(target + "/read/" + id);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
  update: async (target, id, jsonData, option = {}) => {
    try {
      const response = await axiosInstance.patch(
        target + "/update/" + id,
        jsonData
      );
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  delete: async (target, id, option = {}) => {
    try {
      const response = await axiosInstance.delete(target + "/delete/" + id);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  filter: async (target, option = {}) => {
    try {
      let query = "";

      let filter = "";
      let equal = "";
      if (option.filter) {
        filter = "filter=" + option.filter;
      }
      if (option.equal) {
        equal = "&equal=" + option.equal;
      }
      query = `?${filter}${equal}`;

      const response = await axiosInstance.get(target + "/filter" + query);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  search: async (target, source, option = {}) => {
    try {
      let query = "";
      if (option != {}) {
        let fields = option.fields ? "fields=" + option.fields : "";
        let question = option.question ? "&q=" + option.question : "";
        // if (option.fields) {
        //   fields = "fields=" + option.fields;
        // }
        // if (option.question) {
        //   question = "&q=" + option.question;
        // }
        query = `?${fields}${question}`;
      }
      headersInstance.cancelToken = source.token;
      const response = await axiosInstance.get(target + "/search" + query, {
        headers: headersInstance,
      });
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  list: async (target, option = {}) => {
    try {
      let query = "";
      if (option != {}) {
        let page = "";
        let items = "";
        if (option.page) {
          page = "page=" + option.page;
        }
        if (option.items) {
          items = "&items=" + option.items;
        }
        query = `?${page}${items}`;
      }

      const response = await axiosInstance.get(target + "/list" + query);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },

  post: async (targetUrl, jsonData, option = {}) => {
    try {
      const response = await axiosInstance.post(targetUrl, jsonData);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
  get: async (targetUrl, option = {}) => {
    try {
      const response = await axiosInstance.get(targetUrl);
      return successHandler(response);
    } catch (error) {
      return errorHandler(error);
    }
  },
  source: async () => {
    const CancelToken = await axiosInstance.CancelToken;
    const source = CancelToken.source();
    return source;
  },
};
export default request;
