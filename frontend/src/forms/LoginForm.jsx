import React from 'react';
import { Form, Input, Checkbox, Button, Divider } from 'antd';
import { UserOutlined, LockOutlined, GoogleOutlined } from '@ant-design/icons';
import { API_BASE_URL } from '@/config/serverApiConfig';

import useLanguage from '@/locale/useLanguage';

export default function LoginForm() {
  const translate = useLanguage();
  return (
    <div>
      <Form.Item
        label={translate('email')}
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
          placeholder={'admin@admin.com'}
          type="email"
          size="large"
        />
      </Form.Item>
      <Form.Item
        label={translate('password')}
        name="password"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder={'admin123'}
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>{translate('Remember me')}</Checkbox>
        </Form.Item>
        <a className="login-form-forgot" href="/forgetpassword" style={{ marginLeft: '0px' }}>
          {translate('Forgot password')}
        </a>
      </Form.Item>
       <Divider>{translate('Or')}</Divider>

      <Form.Item>
        <Button
          icon={<GoogleOutlined />}
          size="large"
          block
          href={`${API_BASE_URL}/api/auth/google`}
          style={{ 
            backgroundColor: '#4285F4', 
            color: 'white',
            height: '46px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            borderRadius: '4px'
          }}
        >
          {translate('Continue with Google')}
        </Button>
    </div>
  );
}
