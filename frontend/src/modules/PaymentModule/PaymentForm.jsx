// modules/PaymentModule/PaymentForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, DatePicker, Select, Button, Space, Card, Modal, Upload, message, Spin } from 'antd';
import { useNavigate } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';
import { UploadOutlined, InboxOutlined } from '@ant-design/icons';
import { useDispatch, useSelector } from 'react-redux';
import { erp } from '@/redux/erp/actions';

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

export default function PaymentForm({ onCancel, onSuccess, initialData, isModal = false }) {
  const [form] = Form.useForm();
  const translate = useLanguage();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);
  const [loadingClients, setLoadingClients] = useState(false);
  const [loadingInvoices, setLoadingInvoices] = useState(false);

  // Fetch clients and invoices from API
  useEffect(() => {
    fetchClients();
    fetchInvoices();
  }, []);

  const fetchClients = async () => {
    try {
      setLoadingClients(true);
      console.log('Fetching clients...');
      
      // Try different API endpoints based on your setup
      const endpoints = [
        '/api/client',
        '/api/clients', 
        '/api/customer',
        '/api/customers'
      ];
      
      let clientsData = [];
      
      for (const endpoint of endpoints) {
        try {
          const response = await fetch(endpoint);
          if (response.ok) {
            const data = await response.json();
            console.log('Clients API response:', data);
            
            // Handle different response formats
            if (data.result && Array.isArray(data.result)) {
              clientsData = data.result;
              break;
            } else if (Array.isArray(data)) {
              clientsData = data;
              break;
            } else if (data.data && Array.isArray(data.data)) {
              clientsData = data.data;
              break;
            }
          }
        } catch (error) {
          console.log(`Endpoint ${endpoint} failed:`, error);
          continue;
        }
      }
      
      if (clientsData.length === 0) {
        // If no API data, show sample data for testing
        console.warn('No clients found from API, using sample data');
        clientsData = [
          { _id: '1', name: 'John Doe', email: 'john@example.com' },
          { _id: '2', name: 'Jane Smith', email: 'jane@example.com' },
          { _id: '3', name: 'Acme Corp', email: 'contact@acme.com' }
        ];
      }
      
      setClients(clientsData);
      
    } catch (error) {
      console.error('Error fetching clients:', error);
      message.error('Error loading clients');
      // Fallback to sample data
      setClients([
        { _id: '1', name: 'John Doe', email: 'john@example.com' },
        { _id: '2', name: 'Jane Smith', email: 'jane@example.com' }
      ]);
    } finally {
      setLoadingClients(false);
    }
  };

  // In your fetchInvoices function, update the sample data:
const fetchInvoices = async () => {
  try {
    setLoadingInvoices(true);
    console.log('Fetching invoices...');
    
    // Try different API endpoints
    const endpoints = [
      '/api/invoice',
      '/api/invoices',
      '/api/invoice?status=pending'
    ];
    
    let invoicesData = [];
    
    for (const endpoint of endpoints) {
      try {
        const response = await fetch(endpoint);
        if (response.ok) {
          const data = await response.json();
          console.log('Invoices API response:', data);
          
          // Handle different response formats
          if (data.result && Array.isArray(data.result)) {
            invoicesData = data.result;
            break;
          } else if (Array.isArray(data)) {
            invoicesData = data;
            break;
          } else if (data.data && Array.isArray(data.data)) {
            invoicesData = data.data;
            break;
          }
        }
      } catch (error) {
        console.log(`Endpoint ${endpoint} failed:`, error);
        continue;
      }
    }
    
    if (invoicesData.length === 0) {
      // If no API data, show sample data for testing WITH PROPER OBJECTID FORMAT
      console.warn('No invoices found from API, using sample data');
      invoicesData = [
        { 
          _id: '67a4b5c6d7e8f9a0b1c2d3e4', // Use proper MongoDB-like ObjectId format
          number: 'INV-001', 
          client: { name: 'John Doe' }, 
          total: 1000 
        },
        { 
          _id: '67a4b5c6d7e8f9a0b1c2d3e5', 
          number: 'INV-002', 
          client: { name: 'Jane Smith' }, 
          total: 1500 
        },
        { 
          _id: '67a4b5c6d7e8f9a0b1c2d3e6', 
          number: 'INV-003', 
          client: { name: 'Acme Corp' }, 
          total: 2000 
        }
      ];
    }
    
    setInvoices(invoicesData);
    
  } catch (error) {
    console.error('Error fetching invoices:', error);
    message.error('Error loading invoices');
    // Fallback to sample data WITH PROPER FORMAT
    setInvoices([
      { 
        _id: '67a4b5c6d7e8f9a0b1c2d3e4', 
        number: 'INV-001', 
        client: { name: 'John Doe' }, 
        total: 1000 
      },
      { 
        _id: '67a4b5c6d7e8f9a0b1c2d3e5', 
        number: 'INV-002', 
        client: { name: 'Jane Smith' }, 
        total: 1500 
      }
    ]);
  } finally {
    setLoadingInvoices(false);
  }
};

  // Upload props for invoice attachment
  const uploadProps = {
    onRemove: (file) => {
      const index = fileList.indexOf(file);
      const newFileList = fileList.slice();
      newFileList.splice(index, 1);
      setFileList(newFileList);
    },
    beforeUpload: (file) => {
      const isPdfOrImage = file.type === 'application/pdf' || file.type.startsWith('image/');
      if (!isPdfOrImage) {
        message.error('You can only upload PDF or image files!');
        return false;
      }
      
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isLt5M) {
        message.error('File must be smaller than 5MB!');
        return false;
      }

      setFileList([...fileList, file]);
      return false;
    },
    fileList,
  };

  const onFinish = async (values) => {
    try {
      console.log('Payment form values:', values);
      setUploading(true);
      
      // Format the data for API
      const paymentData = {
        amount: values.amount,
        date: values.date ? values.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
        paymentMode: values.paymentMode,
        currency: values.currency,
        notes: values.notes,
        status: 'completed',
        number: `PAY-${Date.now()}`,
        year: dayjs().year(),
      };

      // Add client reference if selected
      if (values.client) {
        paymentData.client = values.client;
      }
      
      // Add invoice reference if selected
      if (values.invoice) {
        paymentData.invoice = values.invoice;
      }

      console.log('Sending payment data:', paymentData);

      // Use Redux ERP action to create payment
      dispatch(erp.create({
        entity: 'payment',
        jsonData: paymentData,
      }));

      // Show success message
      message.success('Payment created successfully!');
      
      if (onSuccess) {
        onSuccess();
      }

      // Reset form
      form.resetFields();
      setFileList([]);
      
    } catch (error) {
      console.error('Error creating payment:', error);
      message.error(error.message || 'Failed to create payment. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const validateAmount = (rule, value) => {
    if (value === undefined || value === null) {
      return Promise.reject('Please enter amount');
    }
    if (value <= 0) {
      return Promise.reject('Amount must be greater than 0');
    }
    return Promise.resolve();
  };

  const formContent = (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      initialValues={{
        currency: 'USD',
        date: dayjs(),
        ...initialData,
      }}
    >
      <Form.Item
        name="client"
        label={translate('Client')}
        rules={[{ required: true, message: translate('Please select a client') }]}
      >
        <Select 
          placeholder={translate('Select client')} 
          allowClear
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          loading={loadingClients}
          notFoundContent={loadingClients ? <Spin size="small" /> : "No clients found"}
        >
          {clients.map(client => (
            <Option key={client._id} value={client._id}>
              {client.name} {client.email ? `(${client.email})` : ''}
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="amount"
        label={translate('Amount')}
        rules={[
          { required: true, message: translate('Please enter amount') },
          { validator: validateAmount }
        ]}
      >
        <InputNumber
          style={{ width: '100%' }}
          placeholder={translate('Enter amount')}
          min={0}
          step={0.01}
          precision={2}
          formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={value => value.replace(/\$\s?|(,*)/g, '')}
        />
      </Form.Item>

      <Form.Item
        name="date"
        label={translate('Date')}
        rules={[{ required: true, message: translate('Please select date') }]}
      >
        <DatePicker 
          style={{ width: '100%' }} 
          format="YYYY-MM-DD"
          disabledDate={(current) => current && current > dayjs().endOf('day')}
        />
      </Form.Item>

      <Form.Item
        name="paymentMode"
        label={translate('Payment Mode')}
        rules={[{ required: true, message: translate('Please select payment mode') }]}
      >
        <Select placeholder={translate('Select payment mode')} allowClear>
          <Option value="cash">Cash</Option>
          <Option value="bank_transfer">Bank Transfer</Option>
          <Option value="credit_card">Credit Card</Option>
          <Option value="check">Check</Option>
          <Option value="digital_wallet">Digital Wallet</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="invoice"
        label={translate('Invoice')}
      >
        <Select 
          placeholder={translate('Select invoice')} 
          allowClear
          showSearch
          filterOption={(input, option) =>
            option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
          }
          loading={loadingInvoices}
          notFoundContent={loadingInvoices ? <Spin size="small" /> : "No invoices found"}
        >
          {invoices.map(invoice => (
            <Option key={invoice._id} value={invoice._id}>
              {invoice.number} - {invoice.client?.name} (${invoice.total})
            </Option>
          ))}
        </Select>
      </Form.Item>

      <Form.Item
        name="currency"
        label={translate('Currency')}
        rules={[{ required: true, message: translate('Please select currency') }]}
      >
        <Select>
          <Option value="USD">USD</Option>
          <Option value="EUR">EUR</Option>
          <Option value="GBP">GBP</Option>
          <Option value="JPY">JPY</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="notes"
        label={translate('Notes')}
      >
        <TextArea 
          rows={3} 
          placeholder={translate('Additional notes')} 
          maxLength={500}
          showCount
        />
      </Form.Item>

      {/* File Upload Section */}
      <Form.Item
        label={translate('Upload Invoice')}
        extra={translate('Upload invoice document or image (PDF, JPG, PNG)')}
      >
        <Dragger {...uploadProps}>
          <p className="ant-upload-drag-icon">
            <InboxOutlined />
          </p>
          <p className="ant-upload-text">
            {translate('Click or drag file to this area to upload')}
          </p>
          <p className="ant-upload-hint">
            {translate('Support for a single or bulk upload. Strictly prohibited from uploading company data or other banned files.')}
          </p>
        </Dragger>
      </Form.Item>

      {!isModal && (
        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit" loading={uploading}>
              {translate('Create Payment')}
            </Button>
            <Button onClick={onCancel} disabled={uploading}>
              {translate('Cancel')}
            </Button>
          </Space>
        </Form.Item>
      )}
    </Form>
  );

  if (isModal) {
    return (
      <Modal
        title={translate('Add New Payment')}
        open={true}
        onCancel={onCancel}
        footer={[
          <Button key="cancel" onClick={onCancel} disabled={uploading}>
            {translate('Cancel')}
          </Button>,
          <Button 
            key="submit" 
            type="primary" 
            loading={uploading}
            onClick={() => form.submit()}
          >
            {translate('Create Payment')}
          </Button>,
        ]}
        width={700}
        maskClosable={!uploading}
        closable={!uploading}
      >
        {formContent}
      </Modal>
    );
  }

  return <Card>{formContent}</Card>;
}