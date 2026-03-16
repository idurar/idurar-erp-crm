import React, { useState } from 'react';
import { Modal, Upload, Button, message, Typography } from 'antd';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

const { Dragger } = Upload;
const { Text } = Typography;

const UploadPaymentModal = ({ visible, onCancel, onUpload }) => {
  const translate = useLanguage();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error(translate('please_select_file'));
      return;
    }

    setUploading(true);
    try {
      const file = fileList[0];
      await onUpload(file);
      message.success(translate('upload_successful'));
      setFileList([]);
      onCancel();
    } catch (error) {
      message.error(translate('upload_failed'));
    } finally {
      setUploading(false);
    }
  };

  const uploadProps = {
    onRemove: (file) => {
      setFileList([]);
    },
    beforeUpload: (file) => {
      // Validate file type
      const isCSV = file.type === 'text/csv' || file.name.endsWith('.csv');
      const isExcel = 
        file.type === 'application/vnd.ms-excel' || 
        file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.name.endsWith('.xls') || 
        file.name.endsWith('.xlsx');

      if (!isCSV && !isExcel) {
        message.error(translate('only_csv_excel_files'));
        return false;
      }

      setFileList([file]);
      return false; // Prevent auto upload
    },
    fileList,
    multiple: false,
  };

  return (
    <Modal
      title={translate('upload_payments')}
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" onClick={onCancel}>
          {translate('cancel')}
        </Button>,
        <Button
          key="upload"
          type="primary"
          loading={uploading}
          onClick={handleUpload}
          disabled={fileList.length === 0}
        >
          {translate('upload')}
        </Button>,
      ]}
    >
      <div style={{ marginBottom: 16 }}>
        <Text type="secondary">
          {translate('upload_payment_instructions')}
        </Text>
      </div>
      
      <Dragger {...uploadProps}>
        <p className="ant-upload-drag-icon">
          <InboxOutlined />
        </p>
        <p className="ant-upload-text">
          {translate('click_or_drag_file')}
        </p>
        <p className="ant-upload-hint">
          {translate('support_csv_excel')}
        </p>
      </Dragger>

      <div style={{ marginTop: 16 }}>
        <Text strong>{translate('expected_columns')}:</Text>
        <br />
        <Text type="secondary">
          client, amount, date, invoice_number, payment_mode
        </Text>
      </div>
    </Modal>
  );
};

export default UploadPaymentModal;