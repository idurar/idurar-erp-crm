import React from "react";
import { Layout } from "antd";
export default function AuthLayout({ sideContent, children }) {
  return (
    <Layout
      style={{
        minHeight: "100vh",
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <div style={{ width: "50%" }}>{sideContent}</div>
      <div style={{ width: "50%", background: "#FFF" }}>{children}</div>
    </Layout>
  );
}
