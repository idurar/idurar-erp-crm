import React, { useEffect, useState } from 'react';

import DefaultLayout from '../DefaultLayout';

import SidePanel from '@/components/SidePanel';
import { Layout } from 'antd';
import { useCrudContext } from '@/context/crud';
import { useAppContext } from '@/context/appContext';

const { Content } = Layout;

const ContentBox = ({ children }) => {
  const { state: stateCrud, crudContextAction } = useCrudContext();
  const { state: stateApp } = useAppContext();
  const { isPanelClose } = stateCrud;
  const { isNavMenuClose } = stateApp;
  const { panel } = crudContextAction;

  const [isSidePanelClose, setSidePanel] = useState(isPanelClose);

  useEffect(() => {
    let timer = [];
    if (isPanelClose) {
      timer = setTimeout(() => {
        setSidePanel(isPanelClose);
      }, 200);
    } else {
      setSidePanel(isPanelClose);
    }

    return () => clearTimeout(timer);
  }, [isPanelClose]);

  useEffect(() => {
    if (!isNavMenuClose) {
      panel.close();
    }
  }, [isNavMenuClose]);
  return (
    <Content
      className="whiteBox shadow"
      style={{
        padding: '50px 40px',
        margin: '100px auto',
        width: isSidePanelClose ? '100%' : '830px',
        maxWidth: '1000px',
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
        <Layout style={{ minHeight: '100vh' }}>
          <SidePanel
            config={config}
            topContent={sidePanelTopContent}
            bottomContent={sidePanelBottomContent}
            fixHeaderPanel={fixHeaderPanel}
          ></SidePanel>
          <Layout>
            <ContentBox> {children}</ContentBox>
          </Layout>
        </Layout>
      </DefaultLayout>
    </>
  );
}
