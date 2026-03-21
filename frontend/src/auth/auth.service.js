import { API_BASE_URL } from '@/config/serverApiConfig';
import api from '@/request/httpTokenClient';   // <-- changed here
import errorHandler from '@/request/errorHandler';
import successHandler from '@/request/successHandler';

export const login = async ({ loginData }) => {
  try {
    const response = await api.post(
      `login?timestamp=${new Date().getTime()}`,
      loginData
    );
    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      }
    );

    return data;
  } catch (error) {
    return errorHandler(error);
  }
};

export const register = async ({ registerData }) => {
  try {
    const response = await api.post(`register`, registerData);
    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );
    return data;
  } catch (error) {
    return errorHandler(error);
  }
};

export const verify = async ({ userId, emailToken }) => {
  try {
    const response = await api.get(`verify/${userId}/${emailToken}`);
    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );

    return data;
  } catch (error) {
    return errorHandler(error);
  }
};

export const resetPassword = async ({ resetPasswordData }) => {
  try {
    const response = await api.post(`resetpassword`, resetPasswordData);
    const { status, data } = response;

    successHandler(
      { data, status },
      {
        notifyOnSuccess: true,
        notifyOnFailed: true,
      }
    );

    return data;
  } catch (error) {
    return errorHandler(error);
  }
};

export const logout = async () => {
  try {
    const response = await api.post(`logout?timestamp=${new Date().getTime()}`);
    const { status, data } = response;
    successHandler(
      { data, status },
      {
        notifyOnSuccess: false,
        notifyOnFailed: true,
      }
    );

    return data;
  } catch (error) {
    return errorHandler(error);
  }
};
