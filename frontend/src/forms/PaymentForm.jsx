// forms/PaymentForm.jsx
import React, { useState, useEffect } from 'react';
import { Form, Input, InputNumber, DatePicker, Select, Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

export default function PaymentCreateForm({ subTotal, current = null }) {
  const translate = useLanguage();
  const [fileList, setFileList] = useState([]);
  const [clients, setClients] = useState([]);
  const [invoices, setInvoices] = useState([]);

  // Fetch clients and invoices
  useEffect(() => {
    fetchClients();
    fetchInvoices();
  }, []);

  const fetchClients = async () => {
    try {
      const response = await fetch('/api/client?limit=100');
      if (response.ok) {
        const data = await response.json();
        setClients(data.result || data.data || data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/invoice?limit=100&status=pending');
      if (response.ok) {
        const data = await response.json();
        setInvoices(data.result || data.data || data);
      }
    } catch (error) {
      console.error('Error fetching invoices:', error);
    }
  };

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

  const validateAmount = (rule, value) => {
    if (value === undefined || value === null) {
      return Promise.reject('Please enter amount');
    }
    if (value <= 0) {
      return Promise.reject('Amount must be greater than 0');
    }
    return Promise.resolve();
  };

  return (
    <>
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
        >
          {clients.map(client => (
            <Option key={client._id} value={client._id}>
              {client.name} {client.email ? `(${client.email})` : ''}
            </Option>
          ))}
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
        >
          {invoices.map(invoice => (
            <Option key={invoice._id} value={invoice._id}>
              {invoice.number} - {invoice.client?.name} (${invoice.total})
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
        initialValue={dayjs()}
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
        name="currency"
        label={translate('Currency')}
        rules={[{ required: true, message: translate('Please select currency') }]}
        initialValue="USD"
      >
        <Select>
          <Option value="USD">USD</Option>
          <Option value="EUR">EUR</Option>
          <Option value="GBP">GBP</Option>
          <Option value="JPY">JPY</Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="status"
        label={translate('Status')}
        initialValue="completed"
      >
        <Select>
          <Option value="pending">Pending</Option>
          <Option value="completed">Completed</Option>
          <Option value="failed">Failed</Option>
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

      <Form.Item
        label={translate('Upload Receipt')}
        extra={translate('Upload payment receipt (PDF, JPG, PNG)')}
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
    </>
  );
}