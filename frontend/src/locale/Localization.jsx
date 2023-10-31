import { useState, useEffect } from 'react';

import enUS from 'antd/es/locale/en_US';
import zhCN from 'antd/es/locale/zh_CN';
import frFR from 'antd/es/locale/fr_FR';
import arEG from 'antd/es/locale/ar_EG';

import { ConfigProvider } from 'antd';

import { useSelector } from 'react-redux';

import { selectLangCode } from '@/redux/translate/selectors';

export default function Localization({ children }) {
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

  return (
    <ConfigProvider direction={direction} locale={locale}>
      {children}
    </ConfigProvider>
  );
}
