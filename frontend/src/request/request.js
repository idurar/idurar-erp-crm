/**
 * API Request Utility
 * 
 * This module provides a centralized interface for making API requests to the backend.
 * It handles authentication, error handling, and success notifications for all API calls.
 */

import axios from 'axios';
import { API_BASE_URL } from '@/config/serverApiConfig';
import errorHandler from './errorHandler';
import successHandler from './successHandler';
import storePersist from '@/redux/storePersist';

/**
 * Finds a key in an object that starts with the given prefix
 * 
 * @param {Object} object - The object to search in
 * @param {string} prefix - The prefix to search for
 * @returns {string|undefined} - The matching key or undefined if not found
 */
function findKeyByPrefix(object, prefix) {
  for (var property in object) {
    if (object.hasOwnProperty(property) && property.toString().startsWith(prefix)) {
      return property;
    }
  }
}

/**
 * Configures axios with authentication token and base URL
 * 
 * This function sets up axios defaults for all subsequent requests:
 * - Sets the base URL from configuration
 * - Enables credentials (cookies) to be sent with requests
 * - Adds the authentication token to the Authorization header if available
 */
function includeToken() {
  axios.defaults.baseURL = API_BASE_URL;
  axios.defaults.withCredentials = true;
  
  // Get authentication data from persistent storage
  const auth = storePersist.get('auth');

  // Add token to request headers if available
  if (auth) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${auth.current.token}`;
  }
}

/**
 * Request object containing methods for all API operations
 */
const request = {
  /**
   * Creates a new entity
   * 
   * @param {Object} params - Request parameters
   * @param {string} params.entity - The entity type (e.g., 'invoice', 'client')
   * @param {Object} params.jsonData - The data to create the entity with
   * @returns {Promise<Object>} - The API response data
   */
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

  /**
   * Creates a new entity with file upload support
   * 
   * @param {Object} params - Request parameters
   * @param {string} params.entity - The entity type
   * @param {FormData} params.jsonData - The form data including files to upload
   * @returns {Promise<Object>} - The API response data
   */
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

  /**
   * Retrieves a single entity by ID
   * 
   * @param {Object} params - Request parameters
   * @param {string} params.entity - The entity type
   * @param {string} params.id - The entity ID to retrieve
   * @returns {Promise<Object>} - The API response data
   */
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

  /**
   * Updates an existing entity
   * 
   * @param {Object} params - Request parameters
   * @param {string} params.entity - The entity type
   * @param {string} params.id - The entity ID to update
   * @param {Object} params.jsonData - The data to update the entity with
   * @returns {Promise<Object>} - The API response data
   */
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

  /**
   * Updates an existing entity with file upload support
   * 
   * @param {Object} params - Request parameters
   * @param {string} params.entity - The entity type
   * @param {string} params.id - The entity ID to update
   * @param {FormData} params.jsonData - The form data including files to upload
   * @returns {Promise<Object>} - The API response data
   */
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

  /**
   * Deletes an entity by ID
   * 
   * @param {Object} params - Request parameters
   * @param {string} params.entity - The entity type
   * @param {string} params.id - The entity ID to delete
   * @returns {Promise<Object>} - The API response data
   */
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

  /**
   * Filters entities based on criteria
   * 
   * @param {Object} params - Request parameters
   * @param {string} params.entity - The entity type
   * @param {Object} params.options - Filter options
   * @param {string} [params.options.filter] - Filter criteria
   * @param {string} [params.options.equal] - Equality criteria
   * @returns {Promise<Object>} - The API response data
   */
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

  /**
   * Searches for entities matching search criteria
   * 
   * @param {Object} params - Request parameters
   * @param {string} params.entity - The entity type
   * @param {Object} params.options - Search options (e.g., q, fields, page, limit)
   * @returns {Promise<Object>} - The API response data
   */
  search: async ({ entity, options = {} }) => {
    try {
      includeToken();
      let query = '?';
      for (var key in options) {
        query += key + '=' + options[key] + '&';
      }
      query = query.slice(0, -1);
      
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

  /**
   * Lists entities with pagination
   * 
   * @param {Object} params - Request parameters
   * @param {string} params.entity - The entity type
   * @param {Object} params.options - List options (e.g., page, limit, sort, order)
   * @returns {Promise<Object>} - The API response data
   */
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

  /**
   * Lists all entities without pagination
   * 
   * @param {Object} params - Request parameters
   * @param {string} params.entity - The entity type
   * @param {Object} params.options - Additional options
   * @returns {Promise<Object>} - The API response data
   */
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

  /**
   * Makes a generic POST request to an endpoint
   * 
   * @param {Object} params - Request parameters
   * @param {string} params.entity - The endpoint path
   * @param {Object} params.jsonData - The data to send
   * @returns {Promise<Object>} - The API response data
   */
  post: async ({ entity, jsonData }) => {
    try {
      includeToken();
      const response = await axios.post(entity, jsonData);

      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  /**
   * Makes a generic GET request to an endpoint
   * 
   * @param {Object} params - Request parameters
   * @param {string} params.entity - The endpoint path
   * @returns {Promise<Object>} - The API response data
   */
  get: async ({ entity }) => {
    try {
      includeToken();
      const response = await axios.get(entity);
      return response.data;
    } catch (error) {
      return errorHandler(error);
    }
  },

  /**
   * Makes a generic PATCH request to an endpoint
   * 
   * @param {Object} params - Request parameters
   * @param {string} params.entity - The endpoint path
   * @param {Object} params.jsonData - The data to send
   * @returns {Promise<Object>} - The API response data
   */
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

  /**
   * Uploads a file to an entity
   * 
   * @param {Object} params - Request parameters
   * @param {string} params.entity - The entity type
   * @param {string} params.id - The entity ID
   * @param {FormData} params.jsonData - The form data with files
   * @returns {Promise<Object>} - The API response data
   */
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

  /**
   * Creates a cancel token source for cancellable requests
   * 
   * @returns {CancelTokenSource} - The axios cancel token source
   */
  source: () => {
    const CancelToken = axios.CancelToken;
    const source = CancelToken.source();
    return source;
  },

  /**
   * Gets summary data for an entity
   * 
   * @param {Object} params - Request parameters
   * @param {string} params.entity - The entity type
   * @param {Object} params.options - Summary options
   * @returns {Promise<Object>} - The API response data
   */
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

  /**
   * Sends an email related to an entity
   * 
   * @param {Object} params - Request parameters
   * @param {string} params.entity - The entity type (invoice, quote, payment)
   * @param {Object} params.jsonData - Email data (id, to, subject, message)
   * @returns {Promise<Object>} - The API response data
   */
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

  /**
   * Converts one entity to another (e.g., quote to invoice)
   * 
   * @param {Object} params - Request parameters
   * @param {string} params.entity - The entity type (usually 'quote')
   * @param {string} params.id - The entity ID to convert
   * @returns {Promise<Object>} - The API response data
   */
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