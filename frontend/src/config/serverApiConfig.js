export const API_BASE_URL =
  import.meta.env.NODE_ENV == 'production' || import.meta.env.REACT_APP_DEV_REMOTE == 'remote'
    ? import.meta.env.REACT_APP_BACKEND_SERVER + 'api/'
    : 'http://localhost:8888/api/';
export const BASE_URL =
  import.meta.env.NODE_ENV == 'production' || import.meta.env.REACT_APP_DEV_REMOTE == 'remote'
    ? import.meta.env.REACT_APP_BACKEND_SERVER
    : 'http://localhost:8888/';
export const DOWNLOAD_BASE_URL =
  import.meta.env.NODE_ENV == 'production' || import.meta.env.REACT_APP_DEV_REMOTE == 'remote'
    ? import.meta.env.REACT_APP_BACKEND_SERVER + 'download/'
    : 'http://localhost:8888/download/';
export const ACCESS_TOKEN_NAME = 'x-auth-token';
