// src/layout/ErpLayout/index.jsx
import React, { useState } from 'react';
import { ErpContextProvider } from '@/context/erp';
import { Layout, Switch, Space, Typography, Row, Col } from 'antd';
import { BulbOutlined, BulbFilled } from '@ant-design/icons';

const { Content } = Layout;
const { Text } = Typography;

export default function ErpLayout({ children }) {
  const [darkMode, setDarkMode] = useState(false);

  const handleThemeToggle = (checked) => {
    setDarkMode(checked);
    // Add theme switching logic here
    document.body.setAttribute('data-theme', checked ? 'dark' : 'light');
  };

  return (
    <ErpContextProvider>
      <Layout style={{ minHeight: '100vh', background: '#f0f2f5' }}>
        <Content
          style={{
            margin: '30px auto',
            width: '100%',
            maxWidth: '1100px',
            minHeight: '600px',
          }}
        >
          {/* Toggle Button Section */}
          <div 
            className="whiteBox shadow"
            style={{ 
              marginBottom: '20px', 
              padding: '16px 24px',
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center'
            }}
          >
            <Space>
              <Text>Theme Mode:</Text>
              <Switch
                checked={darkMode}
                onChange={handleThemeToggle}
                checkedChildren={<BulbFilled />}
                unCheckedChildren={<BulbOutlined />}
              />
              <Text type="secondary">{darkMode ? 'Dark Mode' : 'Light Mode'}</Text>
            </Space>
          </div>

          {/* Main Content */}
          <div className="whiteBox shadow layoutPadding">
            {children}
          </div>
        </Content>
      </Layout>
    </ErpContextProvider>
  );
}