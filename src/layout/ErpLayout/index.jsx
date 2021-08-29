import React from "react";

import ErpContextLayout from "../ErpContextLayout";
import HeaderContent from "../HeaderContent";

import { Layout } from "antd";

const { Content } = Layout;

export default function ErpLayout({ children, config }) {
  return (
    <ErpContextLayout>
      <Layout className="site-layout">
        <HeaderContent />
        <Content
          className="whiteBox shadow"
          style={{
            padding: "50px 40px",
            margin: "50px auto",
            width: "100%",
            maxWidth: "1100px",
          }}
        >
          {children}
        </Content>
      </Layout>
    </ErpContextLayout>
  );
}
