import { useState, useEffect } from 'react';
import Router from '@/router';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import frFR from 'antd/es/locale/fr_FR';
import arEG from 'antd/es/locale/ar_EG';

import { Layout, ConfigProvider } from 'antd';

import Navigation from '@/app/Navigation';

import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
import { selectLangCode } from '@/redux/translate/selectors';

import HeaderContent from '@/app/HeaderContent';
import { useAppContext } from '@/context/appContext';
// import { useNetworkState } from "react-use";

function App() {
  // const [isOnline] = useNetwork();
  // // const networkState = useNetworkState();

  // if (!isOnline) {
  //   notification.config({
  //     duration: 0,
  //   });
  //   notification.error({
  //     message: "No internet connection",
  //     description: "Cannot connect to the server, Check your internet network",
  //   });
  // }
  const { Content } = Layout;
  const { isLoggedIn } = useSelector(selectAuth);
  const langCode = useSelector(selectLangCode);

  const [locale, setLocal] = useState(enUS);
  const [direction, setDirection] = useState('ltr');

  const { state: stateApp } = useAppContext();
  const { isNavMenuClose } = stateApp;

  useEffect(() => {
    if (langCode === 'fr_fr') {
      setDirection('ltr');
      setLocal(frFR);
    } else if (langCode === 'zh_cn') {
      setDirection('ltr');
      setLocal(zhCN);
    } else if (langCode === 'ar_eg') {
      setDirection('rtl');
      setLocal(arEG);
    } else {
      setDirection('ltr');
      setLocal(enUS);
    }

    return () => {
      return false;
    };
  }, [langCode]);

  if (!isLoggedIn)
    return (
      <ConfigProvider direction={direction} locale={locale}>
        <Router />
      </ConfigProvider>
    );
  else {
    return (
      <ConfigProvider direction={direction} locale={locale}>
        <Layout hasSider>
          <Navigation />
          <Layout
            className={isNavMenuClose ? 'smallNavigation site-layout' : 'wideNavigation layout'}
          >
            <HeaderContent />
            <Content
              style={{
                margin: '60px auto 30px',
                overflow: 'initial',
                width: '100%',
              }}
              className={isNavMenuClose ? 'wideAppContainer' : 'appContainer'}
            >
              <Router isLoggedIn={true} />
            </Content>
          </Layout>
        </Layout>
      </ConfigProvider>
    );
  }
}

export default App;
