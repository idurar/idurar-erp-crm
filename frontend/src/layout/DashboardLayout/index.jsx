import React from 'react';

import { Layout } from 'antd';

const { Content } = Layout;

export default function DashboardLayout({ children }) {
  return (
    <div
      style={{
        marginLeft: 140,
      }}
    >
      {children}
    </div>
  );
}
