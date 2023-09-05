import React from 'react';
import { Form, Input } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

export default function RegisterForm() {
  return (
    <>
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input your Name!',
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="Name"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your Email!',
          },
        ]}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          type='email'
          placeholder="Email"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input Password!',
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Password"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="confirm_password"
        rules={[
          {
            required: true,
            message: 'Enter Password Again!',
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Confirm_password"
          size="large"
        />
      </Form.Item>
    </>
  );
}
