import { useState, useEffect } from 'react';

import { ConfigProvider } from 'antd';

import { useSelector } from 'react-redux';

import { selectLangState } from '@/redux/translate/selectors';

const importLangFile = async () => {
  return await import('./antdLocale');
};

export default function Localization({ children }) {
  const { langCode, langDirection } = useSelector(selectLangState);

  const [locale, setLocal] = useState();
  const [direction, setDirection] = useState();

  useEffect(() => {
    const antdLocale = importLangFile();
    const lang = antdLocale[langCode];
    setDirection(langDirection);
    setLocal(lang);
  }, [langCode]);

  return (
    <ConfigProvider direction={direction} locale={locale}>
      {children}
    </ConfigProvider>
  );
}
