// modules/PaymentModule/PaymentForm.jsx
import React from 'react';
import { Form, Input, InputNumber, DatePicker, Select, Button, Space, Card } from 'antd';
import { useNavigate } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';
import dayjs from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

export default function PaymentForm({ onCancel, onSuccess, initialData }) {
  const [form] = Form.useForm();
  const translate = useLanguage();
  const navigate = useNavigate();

  const onFinish = async (values) => {
    try {
      console.log('Payment form values:', values);
      
      // Format the data for API
      const paymentData = {
        ...values,
        date: values.date ? values.date.format('YYYY-MM-DD') : dayjs().format('YYYY-MM-DD'),
      };

      // TODO: Call your API to create payment
      // await apiService.createPayment(paymentData);
      
      // Show success message (you can use message.success here)
      console.log('Payment created successfully');
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error creating payment:', error);
      // Show error message
    }
  };

  return (
    <Card>
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
          <Select placeholder={translate('Select client')} allowClear>
            {/* TODO: Populate with actual clients from your API */}
            <Option value="client1">Client 1</Option>
            <Option value="client2">Client 2</Option>
            <Option value="client3">Client 3</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="amount"
          label={translate('Amount')}
          rules={[{ required: true, message: translate('Please enter amount') }]}
        >
          <InputNumber
            style={{ width: '100%' }}
            placeholder={translate('Enter amount')}
            min={0}
            step={0.01}
            precision={2}
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
          <Select placeholder={translate('Select invoice')} allowClear>
            {/* TODO: Populate with actual invoices from your API */}
            <Option value="inv-001">INV-001</Option>
            <Option value="inv-002">INV-002</Option>
            <Option value="inv-003">INV-003</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="currency"
          label={translate('Currency')}
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

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              {translate('Create Payment')}
            </Button>
            <Button onClick={onCancel}>
              {translate('Cancel')}
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
}