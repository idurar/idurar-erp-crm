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
            colorPrimary: isDark ? '#9bcf70' : '#205435',
            colorPrimaryHover: isDark ? '#b4df8f' : '#3E885B',
            colorPrimaryActive: isDark ? '#78ad50' : '#01200F',
            colorLink: isDark ? '#9bcf70' : '#205435',
            colorInfo: isDark ? '#9bcf70' : '#3E885B',
            colorSuccess: isDark ? '#79c99e' : '#3E885B',
            colorText: isDark ? '#edf3ee' : '#19231A',
            colorTextHeading: isDark ? '#ffffff' : '#01200F',
            colorBorder: isDark ? '#35413a' : '#dce5df',
            colorBgLayout: isDark ? '#0f1411' : '#f7f9f7',
            colorBgContainer: isDark ? '#171d19' : '#ffffff',
            borderRadius: 6,
          },
          components: {
            Button: {
              primaryShadow: '0 2px 0 rgba(1, 32, 15, 0.16)',
            },
            Menu: {
              itemSelectedBg: isDark ? '#33421d' : '#DCF763',
              itemSelectedColor: isDark ? '#dfffa6' : '#01200F',
              itemHoverBg: isDark ? '#25301b' : '#eef8c2',
              itemHoverColor: isDark ? '#dfffa6' : '#205435',
              darkItemBg: '#171d19',
              darkSubMenuItemBg: '#171d19',
              darkItemColor: '#d9e2db',
              darkItemSelectedBg: '#33421d',
              darkItemSelectedColor: '#dfffa6',
            },
            Progress: {
              defaultColor: isDark ? '#79c99e' : '#3E885B',
              remainingColor: isDark ? '#2a332e' : '#e8eee9',
            },
          },
        }}
      >
        {children}
      </ConfigProvider>
    </ColorModeContext.Provider>
  );
}
