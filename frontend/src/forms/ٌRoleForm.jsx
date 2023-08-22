import React from 'react';
import { Form, Input, Select } from 'antd';

export default function RoleForm({ isUpdateForm = false }) {
  return (
    <>
      <Form.Item
        name="codeName"
        label="CodeName"
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
        label="DisplayName"
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
        label="DashboardType"
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
