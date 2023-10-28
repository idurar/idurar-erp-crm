import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import useLanguage from '@/lang/useLanguage';

export default function LoginForm() {
  const getLang = useLanguage();
  return (
    <>
      <Form.Item
        label={getLang('email')}
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
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder="admin@demo.com"
          type="email"
          autoComplete="email"
          size="large"
        />
      </Form.Item>
      <Form.Item
        label={getLang('password')}
        name="password"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder="admin123"
          size="large"
        />
      </Form.Item>
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>{getLang('Remember me')}</Checkbox>
        </Form.Item>

        <a className="login-form-forgot" href="">
          {getLang('Forgot password')}
        </a>
      </Form.Item>
    </>
  );
}
