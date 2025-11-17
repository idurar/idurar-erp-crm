import api from '@/request/httpTokenClient';
import successHandler from './successHandler';
import errorHandler from './errorHandler';

function buildQuery(options) {
  let query = '?';
  for (var key in options) query += key + '=' + options[key] + '&';
  return query.slice(0, -1);
}

const request = {
  create: async ({ entity, jsonData }) => {
    try {
      const response = await api.post(`${entity}/create`, jsonData);
      successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  createAndUpload: async ({ entity, jsonData }) => {
    try {
      const response = await api.post(`${entity}/create`, jsonData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  read: async ({ entity, id }) => {
    try {
      const response = await api.get(`${entity}/read/${id}`);
      successHandler(response, { notifyOnSuccess: false, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  update: async ({ entity, id, jsonData }) => {
    try {
      const response = await api.patch(`${entity}/update/${id}`, jsonData);
      successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  updateAndUpload: async ({ entity, id, jsonData }) => {
    try {
      const response = await api.patch(`${entity}/update/${id}`, jsonData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  delete: async ({ entity, id }) => {
    try {
      const response = await api.delete(`${entity}/delete/${id}`);
      successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  filter: async ({ entity, options = {} }) => {
    try {
      const response = await api.get(`${entity}/filter${buildQuery(options)}`);
      successHandler(response, { notifyOnSuccess: false, notifyOnFailed: false });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  search: async ({ entity, options = {} }) => {
    try {
      const response = await api.get(`${entity}/search${buildQuery(options)}`);
      successHandler(response, { notifyOnSuccess: false, notifyOnFailed: false });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  list: async ({ entity, options = {} }) => {
    try {
      const response = await api.get(`${entity}/list${buildQuery(options)}`);
      successHandler(response, { notifyOnSuccess: false, notifyOnFailed: false });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  listAll: async ({ entity, options = {} }) => {
    try {
      const response = await api.get(`${entity}/listAll${buildQuery(options)}`);
      successHandler(response, { notifyOnSuccess: false, notifyOnFailed: false });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  post: async ({ entity, jsonData }) => {
    try {
      const response = await api.post(entity, jsonData);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  get: async ({ entity }) => {
    try {
      const response = await api.get(entity);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  patch: async ({ entity, jsonData }) => {
    try {
      const response = await api.patch(entity, jsonData);
      successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  upload: async ({ entity, id, jsonData }) => {
    try {
      const response = await api.patch(`${entity}/upload/${id}`, jsonData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  summary: async ({ entity, options = {} }) => {
    try {
      const response = await api.get(`${entity}/summary${buildQuery(options)}`);
      successHandler(response, { notifyOnSuccess: false, notifyOnFailed: false });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  mail: async ({ entity, jsonData }) => {
    try {
      const response = await api.post(`${entity}/mail/`, jsonData);
      successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  convert: async ({ entity, id }) => {
    try {
      const response = await api.get(`${entity}/convert/${id}`);
      successHandler(response, { notifyOnSuccess: true, notifyOnFailed: true });
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  }
};

export default request;
