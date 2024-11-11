import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';

import errorHandler from './errorHandler';
import successHandler from './successHandler';
import storePersist from '@/redux/storePersist';

function findKeyByPrefix(object, prefix) {
  for (var property in object) {
    if (object.hasOwnProperty(property) && property.toString().startsWith(prefix)) {
      return property;
    }
  }
}

function includeToken() {
  axios.defaults.baseURL = API_BASE_URL;

  axios.defaults.withCredentials = true;
  const auth = storePersist.get('auth');

  if (auth) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.current.token}`;
  }
}

const request = {
  create: async ({ entity, jsonData }) => {
    try {
      includeToken();
      const response = await axios.post(entity + '/create', jsonData);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  createAndUpload: async ({ entity, jsonData }) => {
    try {
      includeToken();
      const response = await axios.post(entity + '/create', jsonData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  read: async ({ entity, id }) => {
    try {
      includeToken();
      const response = await axios.get(entity + '/read/' + id);
      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  update: async ({ entity, id, jsonData }) => {
    try {
      includeToken();
      const response = await axios.patch(entity + '/update/' + id, jsonData);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  updateAndUpload: async ({ entity, id, jsonData }) => {
    try {
      includeToken();
      const response = await axios.patch(entity + '/update/' + id, jsonData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  delete: async ({ entity, id }) => {
    try {
      includeToken();
      const response = await axios.delete(entity + '/delete/' + id);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  filter: async ({ entity, options = {} }) => {
    try {
      includeToken();
      let filter = options.filter ? 'filter=' + options.filter : '';
      let equal = options.equal ? '&equal=' + options.equal : '';
      let query = `?${filter}${equal}`;

      const response = await axios.get(entity + '/filter' + query);
      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  search: async ({ entity, options = {} }) => {
    try {
      includeToken();
      let query = '?';
      for (var key in options) {
        query += key + '=' + options[key] + '&';
      }
      query = query.slice(0, -1);
      // headersInstance.cancelToken = source.token;
      const response = await axios.get(entity + '/search' + query);

      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  list: async ({ entity, options = {} }) => {
    try {
      includeToken();
      let query = '?';
      for (var key in options) {
        query += key + '=' + options[key] + '&';
      }
      query = query.slice(0, -1);

      const response = await axios.get(entity + '/list' + query);

      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  listAll: async ({ entity, options = {} }) => {
    try {
      includeToken();
      let query = '?';
      for (var key in options) {
        query += key + '=' + options[key] + '&';
      }
      query = query.slice(0, -1);

      const response = await axios.get(entity + '/listAll' + query);

      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  post: async ({ entity, jsonData }) => {
    try {
      includeToken();
      const response = await axios.post(entity, jsonData);

      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  get: async ({ entity }) => {
    try {
      includeToken();
      const response = await axios.get(entity);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
  patch: async ({ entity, jsonData }) => {
    try {
      includeToken();
      const response = await axios.patch(entity, jsonData);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  upload: async ({ entity, id, jsonData }) => {
    try {
      includeToken();
      const response = await axios.patch(entity + '/upload/' + id, jsonData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  source: () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    return source;
  },

  summary: async ({ entity, options = {} }) => {
    try {
      includeToken();
      let query = '?';
      for (var key in options) {
        query += key + '=' + options[key] + '&';
      }
      query = query.slice(0, -1);
      const response = await axios.get(entity + '/summary' + query);

      successHandler(response, {
        notifyOnSuccess: false,
        notifyOnFailed: false,
      });

      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  mail: async ({ entity, jsonData }) => {
    try {
      includeToken();
      const response = await axios.post(entity + '/mail/', jsonData);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  convert: async ({ entity, id }) => {
    try {
      includeToken();
      const response = await axios.get(`${entity}/convert/${id}`);
      successHandler(response, {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },
};
export default request;
