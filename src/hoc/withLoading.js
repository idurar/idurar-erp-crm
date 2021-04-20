import * as React from "react";

const withLoading = (Component) => ({ isLoading, ...rest }) => {
  if (isLoading) {
    return <div>Loading ...</div>;
  }

  return <Component {...rest} />;
};

export default withLoading;
