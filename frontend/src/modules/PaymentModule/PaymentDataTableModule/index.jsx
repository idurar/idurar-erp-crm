// modules/PaymentModule/PaymentDataTable/index.jsx
import { ErpLayout } from '@/layout';
import ErpPanel from '@/modules/ErpPanelModule';
import React, { useState } from 'react';
import { Button } from 'antd';
import PaymentModal from '../PaymentModal';

export default function PaymentDataTableModule({ config }) {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const handleSuccess = () => {
    setIsModalVisible(false);
    // Refresh your payment list here
    window.location.reload(); // Or use your state management to refresh
  };

  return (
    <ErpLayout>
      <div style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={showModal}>
          Add New Payment
        </Button>
      </div>
      
      <ErpPanel config={config}></ErpPanel>
      
      <PaymentModal
        visible={isModalVisible}
        onCancel={handleCancel}
        onSuccess={handleSuccess}
      />
    </ErpLayout>
  );
}