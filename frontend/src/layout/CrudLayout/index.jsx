import DefaultLayout from '../DefaultLayout';

import SidePanel from '@/components/SidePanel';
import { Layout } from 'antd';

const { Content } = Layout;

const ContentBox = ({ children }) => {
  return (
    <Content
      className="whiteBox shadow layoutPadding"
      style={{
        margin: '12px 0 30px',
        width: '100%',
        maxWidth: '100%',
        flex: 'none',
      }}
    >
      {children}
    </Content>
  );
};

export default function CrudLayout({
  children,
  config,
  sidePanelTopContent,
  sidePanelBottomContent,
  fixHeaderPanel,
}) {
  return (
    <>
      <DefaultLayout>
        <SidePanel
          config={config}
          topContent={sidePanelTopContent}
          bottomContent={sidePanelBottomContent}
          fixHeaderPanel={fixHeaderPanel}
        ></SidePanel>

        <ContentBox> {children}</ContentBox>
      </DefaultLayout>
    </>
  );
}
