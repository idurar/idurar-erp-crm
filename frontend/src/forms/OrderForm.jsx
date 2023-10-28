import React from 'react';
import { Button, Form, Input, Tag, Select, InputNumber } from 'antd';
import dayjs from 'dayjs';

export default function OrderForm({ isUpdateForm = false }) {
  const validateEmptyString = (_, value) => {
    if (value && value.trim() === '') {
      return Promise.reject(new Error('Field cannot be empty'));
    }

    return Promise.resolve();
  };

  return (
    <>
      <Form.Item
        label="Order ID"
        name="orderId"
        rules={[
          {
            required: true,
          },
          {
            validator: validateEmptyString,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Products"
        name="products"
        rules={[
          {
            required: true,
          },
          {
            validator: validateEmptyString,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Quantity"
        name="quantity"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <InputNumber style={{ width: '100%' }} min={1} />
      </Form.Item>

      <Form.Item
        label="Price"
        name="price"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <InputNumber min={0} precision={2} prefix="$" style={{ width: '100%' }} />
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select>
          <Select.Option value="pending">Pending</Select.Option>
          <Select.Option value="shipped">Shipped</Select.Option>
          <Select.Option value="delivered">Delivered</Select.Option>
          <Select.Option value="cancelled">Cancelled</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Notes"
        name="notes"
        rules={[
          {
            validator: validateEmptyString,
          },
        ]}
      >
        <Input.TextArea rows={4} />
      </Form.Item>
    </>
  );
}
