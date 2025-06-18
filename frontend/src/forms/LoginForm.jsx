import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

export default function LoginForm() {
  const translate = useLanguage();
  
  return (
    <div>
      {/* Email Field */}
      <Form.Item
        label={translate('email')}
        name="email"
        rules={[
          { required: true },
          { type: 'email' },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder={'admin@demo.com'}
          type="email"
          size="large"
        />
      </Form.Item>

      {/* Password Field */}
      <Form.Item
        label={translate('password')}
        name="password"
        rules={[
          { required: true },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder={'admin123'}
          size="large"
        />
      </Form.Item>
        
      {/* Remember Me & Forgot Password */}
      <Form.Item>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Form.Item name="remember" valuePropName="checked" noStyle>
            <Checkbox>{translate('Remember me')}</Checkbox>
          </Form.Item>
          <a className="login-form-forgot" href="/forgetpassword">
            {translate('Forgot password')}
          </a>
        </div>
      </Form.Item>

      {/* Registration Prompt */}
      <Form.Item>
        <div style={{ textAlign: 'center' }}>
          {translate('New Here?')}{' '}
          <a href="/register" style={{ fontWeight: 600 }}>
            {translate('Register')}
          </a>
        </div>
      </Form.Item>
    </div>
  );
}