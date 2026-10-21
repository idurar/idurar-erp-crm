import { ErpContextProvider } from '@/context/erp';

import { Layout } from 'antd';
const { Content } = Layout;

export default function ErpLayout({ children }) {
  return (
    <ErpContextProvider>
      <Content
        className="whiteBox shadow layoutPadding"
        style={{
          margin: '12px 0 30px',
          width: '100%',
          maxWidth: 'none',
          minHeight: '600px',
        }}
      >
        {children}
      </Content>
    </ErpContextProvider>
  );
}
