import { ConfigProvider, theme as antdTheme } from 'antd';
import { createContext, useContext, useEffect, useState } from 'react';
import deDE from 'antd/es/locale/de_DE';
import dayjs from 'dayjs';
import 'dayjs/locale/de';

dayjs.locale('de');

const ColorModeContext = createContext({ isDark: false, toggleColorMode: () => {} });

export const useColorMode = () => useContext(ColorModeContext);

export default function Localization({ children }) {
  const [isDark, setIsDark] = useState(() => {
    const savedMode = window.localStorage.getItem('erp-color-mode');
    if (savedMode) return savedMode === 'dark';
    return window.matchMedia?.('(prefers-color-scheme: dark)').matches || false;
  });

  useEffect(() => {
    document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
    document.documentElement.style.colorScheme = isDark ? 'dark' : 'light';
    window.localStorage.setItem('erp-color-mode', isDark ? 'dark' : 'light');
  }, [isDark]);

  return (
    <ColorModeContext.Provider value={{ isDark, toggleColorMode: () => setIsDark((value) => !value) }}>
      <ConfigProvider
        locale={deDE}
        theme={{
          algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
          token: {
            colorPrimary: isDark ? '#3287CE' : '#12559B',
            colorPrimaryHover: isDark ? '#87B7DE' : '#0C407A',
            colorPrimaryActive: isDark ? '#12559B' : '#062653',
            colorLink: isDark ? '#87B7DE' : '#12559B',
            colorInfo: '#2477BD',
            colorSuccess: '#168568',
            colorWarning: '#C58A22',
            colorError: '#C8424C',
            colorText: isDark ? '#E8F3FC' : '#1B2B42',
            colorTextSecondary: isDark ? '#AFC4D8' : '#64748B',
            colorTextHeading: isDark ? '#ffffff' : '#062653',
            colorBorder: isDark ? '#294866' : '#E1E7EF',
            colorBgLayout: isDark ? '#071A32' : '#F6F8FB',
            colorBgContainer: isDark ? '#0D2744' : '#FFFFFF',
            borderRadius: 8,
          },
          components: {
            Button: {
              primaryShadow: '0 2px 0 rgba(6, 38, 83, 0.14)',
            },
            Menu: {
              itemSelectedBg: '#12559B',
              itemSelectedColor: '#FFFFFF',
              itemHoverBg: '#123968',
              itemHoverColor: '#FFFFFF',
              darkItemBg: '#062653',
              darkSubMenuItemBg: '#062653',
              darkItemColor: '#D7E6F3',
              darkItemSelectedBg: '#12559B',
              darkItemSelectedColor: '#FFFFFF',
            },
            Progress: {
              defaultColor: '#3287CE',
              remainingColor: isDark ? '#173653' : '#E8F3FC',
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ColorModeContext.Provider>
  );
}
