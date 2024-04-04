import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';
import { useSelector } from 'react-redux';
import { selectLangDirection } from '@/redux/translate/selectors';

export default function LoginForm() {
  const langDirection = useSelector(selectLangDirection)

  const translate = useLanguage();
  return (
    <div style={{direction:langDirection}}>
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
          placeholder={translate('email')}
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
          placeholder={translate('password')}
          size="large"
        />
      </Form.Item>
      
      <Form.Item>
        <Form.Item name="remember" valuePropName="checked" noStyle>
          <Checkbox>{translate('Remember me')}</Checkbox>
        </Form.Item>
        <a className="login-form-forgot" href="/forgetpassword" style={{marginLeft:langDirection==="rtl"?"220px":"0px"}}>
          {translate('Forgot password')}
        </a>
        
      </Form.Item>
    </div>
  );
}
