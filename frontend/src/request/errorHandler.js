import { notification } from 'antd';
import codeMessage from './codeMessage';

const errorHandler = (error) => {
  if (!navigator.onLine) {
    notification.config({
      duration: 15,
      maxCount: 1,
    });
    // Code to execute when there is internet connection
    notification.error({
      message: 'Keine Internetverbindung',
      description: 'Bitte prüfen Sie Ihre Netzwerkverbindung.',
    });
    return {
      success: false,
      result: null,
      message: 'Der Server ist nicht erreichbar. Bitte prüfen Sie Ihre Netzwerkverbindung.',
    };
  }

  const { response } = error;

  if (!response) {
    notification.config({
      duration: 20,
      maxCount: 1,
    });
    // Code to execute when there is no internet connection
    // notification.error({
    //   message: 'Problem connecting to server',
    //   description: 'Cannot connect to the server, Try again later',
    // });
    return {
      success: false,
      result: null,
      message: 'Der Server ist nicht erreichbar. Bitte wenden Sie sich an den Administrator.',
    };
  }

  if (response && response.data && response.data.jwtExpired) {
    const result = window.localStorage.getItem('auth');
    const jsonFile = window.localStorage.getItem('isLogout');
    const { isLogout } = (jsonFile && JSON.parse(jsonFile)) || false;
    window.localStorage.removeItem('auth');
    window.localStorage.removeItem('isLogout');
    if (result || isLogout) {
      window.location.href = '/logout';
    }
  }

  if (response && response.status) {
    const message = response.data && response.data.message;

    const errorText = message || codeMessage[response.status];
    const { status } = response;
    notification.config({
      duration: 20,
      maxCount: 2,
    });
    notification.error({
      message: `Fehler ${status}`,
      description: errorText,
    });

    if (response?.data?.error?.name === 'JsonWebTokenError') {
      window.localStorage.removeItem('auth');
      window.localStorage.removeItem('isLogout');
      window.location.href = '/logout';
    } else return response.data;
  } else {
    notification.config({
      duration: 15,
      maxCount: 1,
    });

    if (navigator.onLine) {
      // Code to execute when there is internet connection
      notification.error({
        message: 'Verbindungsfehler',
        description: 'Der Server ist nicht erreichbar. Bitte versuchen Sie es später erneut.',
      });
      return {
        success: false,
        result: null,
        message: 'Der Server ist nicht erreichbar. Bitte wenden Sie sich an den Administrator.',
      };
    } else {
      // Code to execute when there is no internet connection
      notification.error({
        message: 'Keine Internetverbindung',
        description: 'Bitte prüfen Sie Ihre Netzwerkverbindung.',
      });
      return {
        success: false,
        result: null,
        message: 'Der Server ist nicht erreichbar. Bitte prüfen Sie Ihre Netzwerkverbindung.',
      };
    }
  }
};

export default errorHandler;
