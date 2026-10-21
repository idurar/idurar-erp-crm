const withTrailingSlash = (url) => `${url || ''}`.replace(/\/*$/, '/');
const configuredBackend = withTrailingSlash(import.meta.env.VITE_BACKEND_SERVER);
const localBackend = 'http://localhost:8888/';

export const BASE_URL =
  import.meta.env.PROD || import.meta.env.VITE_DEV_REMOTE ? configuredBackend : localBackend;
export const API_BASE_URL = `${BASE_URL}api/`;

export const WEBSITE_URL = withTrailingSlash(
  import.meta.env.VITE_WEBSITE_URL || 'http://localhost:3000/'
);
export const DOWNLOAD_BASE_URL = `${BASE_URL}download/`;
export const ACCESS_TOKEN_NAME = 'x-auth-token';

export const FILE_BASE_URL = import.meta.env.VITE_FILE_BASE_URL;

//  console.log(
//    '🚀 Welcome to WIEpilot ERP CRM! Did you know that we also offer commercial customization services? Contact us at hi@wiedesign.at for more information.'
//  );
