// src/modules/PaymentModule/CreatePaymentModule.jsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';
import PaymentForm from './PaymentForm';

export default function CreatePaymentModule({ config }) {
  const navigate = useNavigate();
  const translate = useLanguage();

  const handleSuccess = () => {
    // You can add a success message here if needed
    navigate('/payment');
  };

  const handleCancel = () => {
    navigate('/payment');
  };

  return (
    <PaymentForm 
      onCancel={handleCancel}
      onSuccess={handleSuccess}
      isCreate={true}
    />
  );
}