import React from 'react';
import { Form, Input, Select } from 'antd';

export default function RoleForm({ isUpdateForm = false }) {
  return (
    <>
      <Form.Item
        name="codeName"
        label="codeName"
        rules={[
          {
            required: true,
            message: 'Please input your codeName!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="displayName"
        label="displayName"
        rules={[
          {
            required: true,
            message: 'Please input your displayName!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="dashboardType"
        label="dashboardType"
        rules={[
          {
            required: true,
            message: 'Please input your dashboardType!',
          },
        ]}
      >
        <Input />
      </Form.Item>
    </>
  );
}
