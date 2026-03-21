import React from 'react';
import { Row, Col, Typography } from 'antd';
import CurrencyConverter from '@/components/CurrencyConverter';
import useLanguage from '@/locale/useLanguage';

const { Title, Paragraph } = Typography;

const CurrencyTools = () => {
  const translate = useLanguage();
  
  return (
    <>
      <div className="whiteBox shadow">
        <Row>
          <Col span={24}>
            <Title level={3}>{translate('Currency Tools')}</Title>
            <Paragraph>
              {translate('Use these tools to help with currency conversions and calculations for your international clients.')}
            </Paragraph>
          </Col>
        </Row>
      </div>
      
      <div className="space30"></div>
      
      <Row gutter={[24, 24]}>
        <Col xs={24} sm={24} md={12} lg={12}>
          <CurrencyConverter />
        </Col>
        <Col xs={24} sm={24} md={12} lg={12}>
          <div className="whiteBox shadow" style={{ height: '100%', padding: '20px' }}>
            <Title level={4}>{translate('About Currency Conversion')}</Title>
            <Paragraph>
              {translate('This tool provides approximate currency conversion based on recent exchange rates. For the most accurate rates, please refer to financial institutions or official forex sources.')}
            </Paragraph>
            <Paragraph>
              {translate('Exchange rates are updated periodically and should be used as a reference only. Actual transaction rates may vary.')}
            </Paragraph>
            <Paragraph>
              {translate('Supported currencies include:')}
            </Paragraph>
            <ul>
              <li>USD - United States Dollar</li>
              <li>EUR - Euro</li>
              <li>GBP - British Pound</li>
              <li>JPY - Japanese Yen</li>
              <li>CAD - Canadian Dollar</li>
              <li>AUD - Australian Dollar</li>
              <li>INR - Indian Rupee</li>
              <li>CNY - Chinese Yuan</li>
              <li>BRL - Brazilian Real</li>
              <li>ZAR - South African Rand</li>
            </ul>
          </div>
        </Col>
      </Row>
    </>
  );
};

export default CurrencyTools;