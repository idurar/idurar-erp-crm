import axios from "axios";
import { baseUrl } from "./config";
import loader from "./loader";

export const createSync = (target, jsonData, option = {}) => {
  console.info("Create Api Data :  " + JSON.stringify(jsonData));
  if (option.loaderWarpper) {
    loader.init(option.loaderWarpper);
  }
  const result = axios
    .post(baseUrl + target + "/create", jsonData)
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
      return error.response.data;
    })
    .finally(function () {
      if (option.loaderWarpper) {
        loader.remove(option.loaderWarpper);
      }
    });

  return result;
};
export const readSync = (target, id, option = {}) => {
  if (option.loaderWarpper) {
    loader.init(option.loaderWarpper);
  }
  const result = axios
    .get(baseUrl + target + "/read/" + id)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response.data;
    })
    .finally(function () {
      if (option.loaderWarpper) {
        loader.remove(option.loaderWarpper);
      }
    });

  return result;
};
export const updateSync = (target, id, jsonData, option = {}) => {
  if (option.loaderWarpper) {
    loader.init(option.loaderWarpper);
  }
  const result = axios
    .patch(baseUrl + target + "/update/" + id, jsonData)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response.data;
    })
    .finally(function () {
      if (option.loaderWarpper) {
        loader.remove(option.loaderWarpper);
      }
    });

  return result;
};

export const deleteSync = (target, id, option = {}) => {
  if (option.loaderWarpper) {
    loader.init(option.loaderWarpper);
  }
  const result = axios
    .delete(baseUrl + target + "/delete/" + id)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response.data;
    })
    .finally(function () {
      if (option.loaderWarpper) {
        loader.remove(option.loaderWarpper);
      }
    });

  return result;
};

export const filterSync = (target, option = {}) => {
  if (option.loaderWarpper) {
    loader.init(option.loaderWarpper);
  }
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

  const result = axios
    .get(baseUrl + target + "/filter" + query)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response.data;
    })
    .finally(function () {
      if (option.loaderWarpper) {
        loader.remove(option.loaderWarpper);
      }
    });

  return result;
};

export const axiosRequest = () => {
  const CancelToken = axios.CancelToken;
  const source = CancelToken.source();
  return source;
};
export const searchSync = (target, source, option = {}) => {
  if (option.loaderWarpper) {
    loader.init(option.loaderWarpper);
  }
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

  const result = axios
    .get(baseUrl + target + "/search" + query, {
      cancelToken: source.token,
    })
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      if (error.response === undefined) {
        return { success: false };
      } else {
        return error.response.data;
      }
    })
    .finally(function () {
      if (option.loaderWarpper) {
        loader.remove(option.loaderWarpper);
      }
    });

  return result;
};
export const listSync = (target, option = {}) => {
  if (option.loaderWarpper) {
    loader.init(option.loaderWarpper);
  }
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

  const result = axios
    .get(baseUrl + target + "/list" + query)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response.data;
    })
    .finally(function () {
      if (option.loaderWarpper) {
        loader.remove(option.loaderWarpper);
      }
    });

  return result;
};
export const uploadSync = (target, jsonData, option = {}) => {
  console.info("Create Api Data :  " + JSON.stringify(jsonData));
  if (option.loaderWarpper) {
    loader.init(option.loaderWarpper);
  }
  const result = axios
    .post(baseUrl + target + "/create", jsonData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    })
    .then((response) => {
      return response.data;
    })
    .catch(function (error) {
      return error.response.data;
    })
    .finally(function () {
      if (option.loaderWarpper) {
        loader.remove(option.loaderWarpper);
      }
    });

  return result;
};

export const multiSync = (promisseArray, option = {}) => {
  if (option.loaderWarpper) {
    loader.init(option.loaderWarpper);
  }

  const result = Promise.all(promisseArray)
    .then(function (responses) {
      return responses;
    })
    .finally(function () {
      if (option.loaderWarpper) {
        loader.remove(option.loaderWarpper);
      }
    });

  return result;
};

export const postDataSync = (targetUrl, jsonData, option = {}) => {
  if (option.loaderWarpper) {
    loader.init(option.loaderWarpper);
  }
  const result = axios
    .post(baseUrl + targetUrl, jsonData)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response.data;
    })
    .finally(function () {
      if (option.loaderWarpper) {
        loader.remove(option.loaderWarpper);
      }
    });

  return result;
};
export const getDataSync = (targetUrl, option = {}) => {
  if (option.loaderWarpper) {
    loader.init(option.loaderWarpper);
  }
  const result = axios
    .get(baseUrl + targetUrl)
    .then((response) => {
      // returning the data here allows the caller to get it through another .then(...)
      //console.log(response.data);
      return response.data;
    })
    .catch(function (error) {
      // handle error
      return error.response.data;
    })
    .finally(function () {
      if (option.loaderWarpper) {
        loader.remove(option.loaderWarpper);
      }
    });

  return result;
};
