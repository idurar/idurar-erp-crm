import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  HomeOutlined,
  IdcardOutlined,
  EditOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons';

export default function RegisterForm() {
  return (
    <>
      <Form.Item
        name="company"
        rules={[
          {
            required: true,
            message: 'Please input your company name!',
          },
        ]}
      >
        <Input
          prefix={<HomeOutlined className="site-form-item-ico" />}
          placeholder="Company name"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input your name!',
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
        name="surname"
        rules={[
          {
            required: true,
            message: 'Please input your surname!',
          },
        ]}
      >
        <Input
          prefix={<UsergroupAddOutlined className="site-form-item-icon" />}
          placeholder="Surname"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="companyRegNumber"
        rules={[
          {
            required: true,
            message: 'Please input your company registration number!',
          },
        ]}
      >
        <Input
          prefix={<IdcardOutlined className="site-form-item-icon" />}
          placeholder="Company registration number"
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
          prefix={<EditOutlined className="site-form-item-icon" />}
          placeholder="Email"
          autoComplete="email"
          size="large"
        />
      </Form.Item>
      <Form.Item
        name="password"
        rules={[
          {
            required: true,
            message: 'Please input your Password!',
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Password"
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>Remember me</Checkbox>
        </Form.Item>
      </Form.Item>
    </>
  );
}
