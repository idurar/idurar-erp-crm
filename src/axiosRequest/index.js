import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../config/serverApiConfig";

const handelToken = () => {
  const token = window.localStorage.getItem(ACCESS_TOKEN_NAME) || "";
  let headerToken = {
    [ACCESS_TOKEN_NAME]: token,
  };
  const headers = { headers: headerToken };
  return headers;
};

export const createSync = async (target, jsonData, option = {}) => {
  const headersObj = handelToken();
  const result = await axios
    .post(API_BASE_URL + target + "/create", jsonData, headersObj)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      // const success = error.response.data.success;
      // const result = error.response.data.result;
      // const message = error.response.data.message;
      // const data = { success, result, message };
      return error.response;
    })
    .finally(function () {});

  return result;
};
export const readSync = async (target, id, option = {}) => {
  const headersObj = handelToken();
  const result = await axios
    .get(API_BASE_URL + target + "/read/" + id, headersObj)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response;
    })
    .finally(function () {});

  return result;
};
export const updateSync = async (target, id, jsonData, option = {}) => {
  const headersObj = handelToken();
  const result = await axios
    .patch(API_BASE_URL + target + "/update/" + id, jsonData, headersObj)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response;
    })
    .finally(function () {});

  return result;
};

export const deleteSync = async (target, id, option = {}) => {
  const headersObj = handelToken();
  const result = await axios
    .delete(API_BASE_URL + target + "/delete/" + id, headersObj)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response;
    })
    .finally(function () {});

  return result;
};

export const filterSync = async (target, option = {}) => {
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

  const headersObj = handelToken();
  const result = await axios
    .get(API_BASE_URL + target + "/filter" + query, headersObj)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response;
    })
    .finally(function () {});

  return result;
};

export const axiosRequest = () => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  return source;
};
export const searchSync = async (target, source, option = {}) => {
  let query = "";
  if (option != {}) {
    let fields = "";
    let question = "";
    if (option.fields) {
      fields = "fields=" + option.fields;
    }
    if (option.question) {
      question = "&q=" + option.question;
    }
    query = `?${fields}${question}`;
  }

  const headersObj = handelToken();
  headersObj.cancelToken = source.token;
  const result = await axios
    .get(API_BASE_URL + target + "/search" + query, headersObj)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      if (error.response === undefined) {
        return { success: false };
      } else {
        return error.response;
      }
    })
    .finally(function () {});

  return result;
};
export const listSync = async (target, option = {}) => {
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
  const headersObj = handelToken();

  const result = await axios
    .get(API_BASE_URL + target + "/list" + query, headersObj)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      console.log("response.data");
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      console.log("error.response");
      console.log(error.response);
      if (error.response.data.jwtExpired) {
        localStorage.removeItem(ACCESS_TOKEN_NAME);
      } else return error.response;
    })
    .finally(function () {});

  return result;
};

export const postDataSync = async (targetUrl, jsonData, option = {}) => {
  const headersObj = handelToken();
  const result = await axios
    .post(API_BASE_URL + targetUrl, jsonData, headersObj)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response;
    })
    .finally(function () {});

  return result;
};
export const getDataSync = async (targetUrl, option = {}) => {
  const headersObj = handelToken();
  const result = await axios
    .get(API_BASE_URL + targetUrl, headersObj)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response;
    })
    .finally(function () {});

  return result;
};
