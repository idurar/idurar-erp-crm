// modules/PaymentModule/PaymentModal.jsx
import React from 'react';
import PaymentForm from './PaymentForm';

export default function PaymentModal({ visible, onCancel, onSuccess }) {
  if (!visible) return null;

  return (
    <PaymentForm
      isModal={true}
      onCancel={onCancel}
      onSuccess={onSuccess}
    />
  );
}