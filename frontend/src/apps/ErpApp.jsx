import { useLayoutEffect } from 'react';

import { Layout } from 'antd';

import { useAppContext } from '@/context/appContext';

import Navigation from '@/apps/components/Navigation';
import HeaderContent from '@/apps/components/HeaderContent';

import { useDispatch } from 'react-redux';
import { settingsAction } from '@/redux/settings/actions';

import AppRouter from '@/router/AppRouter';

export default function ErpCrmApp() {
  const { Content } = Layout;

  const { state: stateApp } = useAppContext();
  const { isNavMenuClose } = stateApp;

  const dispatch = useDispatch();
  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, []);

  return (
    <Layout hasSider>
      <Navigation />

      <Layout
        style={{ marginLeft: isNavMenuClose ? 100 : 220 }}
        className={isNavMenuClose ? 'smallNavigation site-layout' : 'wideNavigation layout'}
      >
        <HeaderContent />

        <Content
          style={{
            margin: '40px auto 30px',
            overflow: 'initial',
            width: '100%',
            maxWidth: isNavMenuClose ? 1150 : 1050,
          }}
        >
          <AppRouter />
        </Content>
      </Layout>
    </Layout>
  );
}
