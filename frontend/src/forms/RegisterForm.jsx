import React from 'react';
import { Form, Input } from 'antd';
import {
  UserOutlined,
  LockOutlined,
  MailOutlined,
  HomeOutlined,
  IdcardOutlined,
} from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function RegisterForm() {
  const translate = useLanguage();
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
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="User name"
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
        name="BankAccount"
        rules={[
          {
            required: true,
            message: 'Please input your bank account number!',
          },
        ]}
      >
        <Input
          prefix={<IdcardOutlined className="site-form-item-icon" />}
          placeholder="Bank account number"
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
          },
          {
            type: 'email',
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
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('The two passwords that you entered do not match!'));
            },
          }),
        ]}
        hasFeedback
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="Confirm password"
          size="large"
        />
      </Form.Item>
    </>
  );
}
