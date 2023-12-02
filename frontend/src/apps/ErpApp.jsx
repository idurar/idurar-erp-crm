import { useLayoutEffect } from 'react';
import { useEffect } from 'react';
import { selectAppSettings } from '@/redux/settings/selectors';
import { useDispatch, useSelector } from 'react-redux';

import { Layout } from 'antd';

import { useAppContext } from '@/context/appContext';

import Navigation from '@/apps/Navigation/NavigationContainer';
import HeaderContent from '@/apps/Header/HeaderContainer';

import { settingsAction } from '@/redux/settings/actions';
import { translateAction } from '@/redux/translate/actions';

import AppRouter from '@/router/AppRouter';

import useResponsive from '@/hooks/useResponsive';

import storePersist from '@/redux/storePersist';

export default function ErpCrmApp() {
  const { Content } = Layout;

  const { state: stateApp } = useAppContext();
  const { isNavMenuClose } = stateApp;

  const { isMobile } = useResponsive();

  const dispatch = useDispatch();

  useLayoutEffect(() => {
    dispatch(settingsAction.list({ entity: 'setting' }));
  }, []);

  const defaultLang = useSelector(selectAppSettings);

  useEffect(() => {
    const { idurar_app_language } = defaultLang;
    const { loadDefaultLang } = storePersist.get('firstLogin');
    if (idurar_app_language && !loadDefaultLang) {
      dispatch(translateAction.translate(idurar_app_language));
      window.localStorage.setItem('firstLogin', JSON.stringify({ loadDefaultLang: true }));
    }
  }, [defaultLang]);

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
