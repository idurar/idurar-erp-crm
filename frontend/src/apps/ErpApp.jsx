import { useLayoutEffect } from 'react';

import { Layout } from 'antd';

import { useAppContext } from '@/context/appContext';

import Navigation from '@/apps/components/Navigation';
import HeaderContent from '@/apps/components/HeaderContent';

import { useDispatch } from 'react-redux';
import { settingsAction } from '@/redux/settings/actions';

import AppRouter from '@/router/AppRouter';

import useIsMobile from '@/hooks/useIsMobile';

export default function ErpCrmApp() {
  const { Content } = Layout;

  const { state: stateApp } = useAppContext();
  const { isNavMenuClose } = stateApp;

  const isMobile = useIsMobile();

  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, []);

  return (
    <Layout hasSider>
      <Navigation />

      {isMobile ? (
        <Layout style={{ marginLeft: 0 }}>
          <HeaderContent />
          <Content
            style={{
              margin: '40px auto 30px',
              overflow: 'initial',
              width: '100%',
              padding: '0 25px',
              maxWidth: 'none',
            }}
          >
            <AppRouter />
          </Content>
        </Layout>
      ) : (
        <Layout style={{ marginLeft: isNavMenuClose ? 100 : 220 }}>
          <HeaderContent />
          <Content
            style={{
              margin: '40px auto 30px',
              overflow: 'initial',
              width: '100%',
              padding: '0 25px',
              maxWidth: isNavMenuClose ? 1200 : 1100,
            }}
          >
            <AppRouter />
          </Content>
        </Layout>
      )}
    </Layout>
  );
}
