"use client"

import { Component } from "react"
import { Result, Button } from "antd"

class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
    }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)

    this.setState({
      error,
      errorInfo,
    })

    // Log to error reporting service
    if (import.meta.env.PROD) {
      // Add your error reporting service here (e.g., Sentry)
      console.error("Production error:", {
        error: error.toString(),
        componentStack: errorInfo.componentStack,
      })
    }
  }

  handleReset = () => {
    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
    })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "100vh",
            padding: "24px",
          }}
        >
          <Result
            status="error"
            title="Something went wrong"
            subTitle="An unexpected error occurred. Please try refreshing the page or contact support if the problem persists."
            extra={[
              <Button type="primary" key="retry" onClick={this.handleReset}>
                Try Again
              </Button>,
              <Button key="home" onClick={() => (window.location.href = "/")}>
                Go Home
              </Button>,
            ]}
          >
            {import.meta.env.DEV && this.state.error && (
              <div
                style={{
                  padding: "16px",
                  marginTop: "16px",
                  background: "#f5f5f5",
                  borderRadius: "4px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontFamily: "monospace",
                  maxWidth: "600px",
                  overflow: "auto",
                }}
              >
                <details>
                  <summary style={{ cursor: "pointer", fontWeight: "bold" }}>Error Details (Development Only)</summary>
                  <pre style={{ margin: "8px 0", whiteSpace: "pre-wrap" }}>{this.state.error.toString()}</pre>
                  {this.state.errorInfo && (
                    <pre style={{ margin: "8px 0", whiteSpace: "pre-wrap" }}>{this.state.errorInfo.componentStack}</pre>
                  )}
                </details>
              </div>
            )}
          </Result>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
