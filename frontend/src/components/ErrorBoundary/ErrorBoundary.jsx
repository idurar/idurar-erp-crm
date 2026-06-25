import React from 'react';

import { Button, notification, Result } from 'antd';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hasError: false,
    };
  }

  static getDerivedStateFromError(error) {
    return {
      hasError: true,
    };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error:', error);
    console.error('Error Info:', errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Result
          status="500"
          title="Oops! Something went wrong"
          subTitle="An unexpected error occurred."
          extra={
            <Button type="primary" onClick={() => window.location.reload()}>
              Reload Application
            </Button>
          }
        />
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;