import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Select, Button, Typography, Divider } from 'antd';
import { SwapOutlined } from '@ant-design/icons';
import { convertCurrency, formatCurrencyAmount, defaultRates } from '@/utils/currencyConverter';
import useLanguage from '@/locale/useLanguage';

const { Option } = Select;
const { Title } = Typography;

const CurrencyConverter = () => {
  const translate = useLanguage();
  const [form] = Form.useForm();
  const [amount, setAmount] = useState(1);
  const [fromCurrency, setFromCurrency] = useState('USD');
  const [toCurrency, setToCurrency] = useState('EUR');
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [exchangeRate, setExchangeRate] = useState(null);

  // Available currencies from our rates object
  const currencies = Object.keys(defaultRates);

  useEffect(() => {
    // Calculate conversion when component mounts
    handleConvert();
  }, []);

  const handleConvert = () => {
    const converted = convertCurrency(amount, fromCurrency, toCurrency);
    setConvertedAmount(converted);
    
    // Calculate and set exchange rate
    const rate = defaultRates[toCurrency] / defaultRates[fromCurrency];
    setExchangeRate(rate);
  };

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    form.setFieldsValue({
      fromCurrency: toCurrency,
      toCurrency: fromCurrency
    });
    
    // Recalculate after swap
    setTimeout(handleConvert, 0);
  };

  return (
    <Card title={translate('Currency Converter')} className="whiteBox shadow" style={{ width: '100%' }}>
      <Form 
        form={form}
        layout="vertical"
        initialValues={{ amount, fromCurrency, toCurrency }}
        onFinish={handleConvert}
      >
        <Form.Item 
          name="amount" 
          label={translate('Amount')}
          rules={[{ required: true, message: translate('Please enter an amount') }]}
        >
          <Input 
            type="number" 
            min={0} 
            step="0.01"
            onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
          />
        </Form.Item>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <Form.Item 
            name="fromCurrency" 
            label={translate('From')}
            style={{ flex: 1 }}
          >
            <Select onChange={(value) => setFromCurrency(value)}>
              {currencies.map(currency => (
                <Option key={currency} value={currency}>{currency}</Option>
              ))}
            </Select>
          </Form.Item>
          
          <Button 
            type="primary" 
            shape="circle" 
            icon={<SwapOutlined />} 
            onClick={handleSwapCurrencies}
            style={{ marginTop: '20px' }}
          />
          
          <Form.Item 
            name="toCurrency" 
            label={translate('To')}
            style={{ flex: 1 }}
          >
            <Select onChange={(value) => setToCurrency(value)}>
              {currencies.map(currency => (
                <Option key={currency} value={currency}>{currency}</Option>
              ))}
            </Select>
          </Form.Item>
        </div>
        
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {translate('Convert')}
          </Button>
        </Form.Item>
      </Form>
      
      {convertedAmount !== null && (
        <>
          <Divider />
          <div style={{ textAlign: 'center' }}>
            <Title level={4}>
              {formatCurrencyAmount(amount, fromCurrency)} = {formatCurrencyAmount(convertedAmount, toCurrency)}
            </Title>
            <p>
              {translate('Exchange Rate')}: 1 {fromCurrency} = {exchangeRate.toFixed(4)} {toCurrency}
            </p>
          </div>
        </>
      )}
    </Card>
  );
};

export default CurrencyConverter;