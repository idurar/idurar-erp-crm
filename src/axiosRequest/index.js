import axios from "axios";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../config/serverApiConfig";
import errorHandler from "./errorHandler";
import successHandler from "./successHandler";

const handelToken = () => {
  const token = window.localStorage.getItem(ACCESS_TOKEN_NAME) || "";
  let headerToken = {
    [ACCESS_TOKEN_NAME]: token,
  };
  const headers = { headers: headerToken };
  return headers;
};

// const successHandler = (response) => {
//   const { data } = response;
//   if (!data || !data.success || data.success === false) {
//     response = {
//       ...response,
//       status: 404,
//       url: null,
//       data: {
//         success: false,
//         result: null,
//       },
//     };
//     return errorHandler({ response });
//   } else {
//     return data;
//   }
// };

export const createSync = async ({ target, jsonData, option = {} }) => {
  const headersObj = handelToken();
  const result = await axios
    .post(API_BASE_URL + target + "/create", jsonData, headersObj)
    .then((response) => {
      return successHandler(response);
    })
    .catch(function (error) {
      // handle error
      return errorHandler(error);
    })
    .finally(function () {});

  return result;
};
export const readSync = async ({ target, id, option = {} }) => {
  const headersObj = handelToken();
  const result = await axios
    .get(API_BASE_URL + target + "/read/" + id, headersObj)
    .then((response) => {
      return successHandler(response);
    })
    .catch(function (error) {
      // handle error
      return errorHandler(error);
    })
    .finally(function () {});

  return result;
};
export const updateSync = async ({ target, id, jsonData, option = {} }) => {
  const headersObj = handelToken();
  const result = await axios
    .patch(API_BASE_URL + target + "/update/" + id, jsonData, headersObj)
    .then((response) => {
      return successHandler(response);
    })
    .catch(function (error) {
      // handle error
      return errorHandler(error);
    })
    .finally(function () {});

  return result;
};

export const deleteSync = async ({ target, id, option = {} }) => {
  const headersObj = handelToken();
  const result = await axios
    .delete(API_BASE_URL + target + "/delete/" + id, headersObj)
    .then((response) => {
      return successHandler(response);
    })
    .catch(function (error) {
      // handle error
      return errorHandler(error);
    })
    .finally(function () {});

  return result;
};

export const filterSync = async ({ target, option = {} }) => {
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
      return successHandler(response);
    })
    .catch(function (error) {
      // handle error
      return errorHandler(error, []);
    })
    .finally(function () {});

  return result;
};

export const axiosRequest = () => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  return source;
};
export const searchSync = async ({ target, source, option = {} }) => {
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
      return successHandler(response);
    })
    .catch(function (error) {
      return errorHandler(error, []);
    })
    .finally(function () {});

  return result;
};
export const listSync = async ({ target, option = {} }) => {
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
      return successHandler(response);
    })
    .catch(function (error) {
      return errorHandler(error);
    })
    .finally(function () {});

  return result;
};

export const postDataSync = async ({ targetUrl, jsonData, option = {} }) => {
  const headersObj = handelToken();
  const result = await axios
    .post(API_BASE_URL + targetUrl, jsonData, headersObj)
    .then((response) => {
      return successHandler(response);
    })
    .catch(function (error) {
      // handle error
      return errorHandler(error);
    })
    .finally(function () {});

  return result;
};
export const getDataSync = async ({ targetUrl, option = {} }) => {
  const headersObj = handelToken();
  const result = await axios
    .get(API_BASE_URL + targetUrl, headersObj)
    .then((response) => {
      return successHandler(response);
    })
    .catch(function (error) {
      // handle error
      return errorHandler(error);
    })
    .finally(function () {});

  return result;
};
