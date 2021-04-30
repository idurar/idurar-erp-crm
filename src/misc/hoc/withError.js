import * as React from "react";

const withError = ({ errorText }) => (Component) => ({ error, ...rest }) => {
  if (error) {
    return <div>{errorText ? errorText : "Something went wrong ..."}</div>;
  }

  return <Component {...rest} />;
};

export default withError;
