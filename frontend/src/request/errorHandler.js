import { notification } from "antd";
import history from "@/utils/history";
import codeMessage from "./codeMessage";

const errorHandler = (error) => {
  const { response } = error;
  console.log(
    "🚀 ~ file: errorHandler.js ~ line 7 ~ errorHandler ~ error",
    error
  );

  if (response === undefined) {
    notification.config({
      duration: 5,
    });
    notification.error({
      message: "No internet connection",
      description: "Cannot connect to the server, Check your internet network",
    });
    return {
      success: false,
      result: null,
      message: "Cannot connect to the server, Check your internet network",
    };
  } else if (response && response.status) {
    const message = response.data && response.data.message;
    const error = response.data && response.data.error;

    const errorText = error || message || codeMessage[response.status];
    const { status } = response;
    notification.config({
      duration: 10,
    });
    notification.error({
      message: `Request error ${status}`,
      description: errorText,
    });
    if (error.response.data.jwtExpired) {
      history.push("/logout");
    }
    return response.data;
  } else {
    notification.config({
      duration: 10,
    });
    notification.error({
      message: "Unknown Error",
      description: "An unknown error occurred in the app, please try again. ",
    });
    return {
      success: false,
      result: null,
      message: "An unknown error occurred in the app, please try again. ",
    };
  }
};

export default errorHandler;
