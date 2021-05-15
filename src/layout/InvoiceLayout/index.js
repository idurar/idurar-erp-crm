import React from "react";

import InvoiceContextLayout from "../InvoiceContextLayout";
import HeaderContent from "../HeaderContent";

import { Layout } from "antd";

const { Content } = Layout;

export default function InvoiceLayout({ children, config }) {
  return (
    <InvoiceContextLayout>
      <Layout className="site-layout">
        <HeaderContent />
        <Content
          className="site-layout-background"
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
    </InvoiceContextLayout>
  );
}
