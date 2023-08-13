import React, { useEffect } from 'react';

import Router from '@/router';

import useNetwork from '@/hooks/useNetwork';

import { Layout, notification } from 'antd';

import Navigation from '@/app/Navigation';

import { useSelector } from 'react-redux';
import { selectAuth } from '@/redux/auth/selectors';
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

  const { isLoggedIn } = useSelector(selectAuth);

  const { state: stateApp } = useAppContext();
  const { isNavMenuClose, isMobile } = stateApp;

  if (!isLoggedIn) return <Router />;
  else {
    return (
      <Layout style={{ minHeight: '100vh' }}>
        <Navigation />
        <HeaderContent />
        {isMobile && isNavMenuClose === false ? null : (
          <Layout style={{ minHeight: '100vh' }}>
            <Router isLoggedIn={true} />
          </Layout>
        )}
      </Layout>
    );
  }
}

export default App;
