import { useState, useEffect } from 'react';
import Router from '@/router';
import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import frFR from 'antd/es/locale/fr_FR';
import arEG from 'antd/es/locale/ar_EG';

import useNetwork from '@/hooks/useNetwork';

import { Layout, ConfigProvider } from 'antd';

import Navigation from '@/app/Navigation';

import { useSelector, useDispatch } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
import { selectLangCode } from '@/redux/lang/selectors';

import HeaderContent from '@/app/HeaderContent';
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

  const { isLoggedIn } = useSelector(selectAuth);
  const langCode = useSelector(selectLangCode);

  const [locale, setLocal] = useState(enUS);
  const [direction, setDirection] = useState('ltr');

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
        <Layout style={{ minHeight: '100vh' }}>
          <Navigation />
          <Layout style={{ minHeight: '100vh' }}>
            <HeaderContent />
            <Router isLoggedIn={true} />
          </Layout>
        </Layout>
      </ConfigProvider>
    );
  }
}

export default App;
