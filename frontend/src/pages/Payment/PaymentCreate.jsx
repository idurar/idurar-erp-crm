// pages/Payment/PaymentCreate.jsx
import React from 'react';
import { Card, Button } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';
import CreatePaymentModule from '@/modules/PaymentModule/CreatePaymentModule';

export default function PaymentCreate() {
  const navigate = useNavigate();
  const translate = useLanguage();

  const entity = 'payment';

  const Labels = {
    PANEL_TITLE: translate('payment'),
    DATATABLE_TITLE: translate('payment_list'),
    ADD_NEW_ENTITY: translate('add_new_payment'),
    ENTITY_NAME: translate('payment'),
  };

  const configPage = {
    entity,
    ...Labels,
  };

  return (
    <Card>
      <div style={{ marginBottom: 16 }}>
        <Button 
          icon={<ArrowLeftOutlined />} 
          onClick={() => navigate('/payment')}
          style={{ marginBottom: 16 }}
        >
          {translate('Back to Payments')}
        </Button>
        <h2>{configPage.ADD_NEW_ENTITY}</h2>
      </div>
      
      <CreatePaymentModule config={configPage} />
    </Card>
  );
}