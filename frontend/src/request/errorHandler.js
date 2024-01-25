import { notification } from 'antd';
import codeMessage from './codeMessage';

const errorHandler = (error) => {
  const { response } = error;

  let jwtExpired = false;

  if (response && response.data && response.data.jwtExpired) {
    jwtExpired = true;
    notification.error({
      message: 'Session Expired',
      description: 'Your session has expired. Please log in again.',
      duration: 5,
    });

    // Perform cleanup
    window.localStorage.removeItem('auth');
    window.localStorage.removeItem('isLogout');
  }

  // Handle other types of HTTP errors
  if (response && response.status) {
    const message = jwtExpired ? 'Session expired. Please log in again.' : (response.data && response.data.message);
    const errorText = message || codeMessage[response.status];
    
    notification.error({
      message: `Request error ${response.status}`,
      description: errorText,
      duration: 4,
    });

    return {
      success: false,
      result: null,
      message: errorText,
    };
  } else {
    notification.error({
      message: navigator.onLine ? 'Problem connecting to server' : 'No internet connection',
      description: navigator.onLine ? 'Cannot connect to the server, try again later' : 'Cannot connect to the Internet, check your internet network',
      duration: 5,
    });

    return {
      success: false,
      result: null,
      message: navigator.onLine ? 'Cannot connect to the server, check your internet network' : 'No internet connection',
    };
  }
};

export default errorHandler;
