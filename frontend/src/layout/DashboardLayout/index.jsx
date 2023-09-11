import React from 'react';

import { Layout } from 'antd';

const { Content } = Layout;

export default function DashboardLayout({ children }) {
  return (
    <Layout className="site-layout">
      <Content
        className="dashboardSpacing"
        style={{
          width: '100%',
          maxWidth: '1100px',
        }}
      >
        {children}
      </Content>
    </Layout>
  );
}
