import React from 'react';
import { Form, Input, Checkbox } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';


import useLanguage from '@/locale/useLanguage';


export default function SignupForm() {
  const translate = useLanguage();


  return (
    <div>
      <Form.Item
        label={translate('Full Name')}
        name="fullName"
        rules={[
          {
            required: true,
            message: translate('Please input your full name!'),
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder={translate('Enter your full name')}
          size="large"
        />
      </Form.Item>


      <Form.Item
        label={translate('email')}
        name="email"
        rules={[
          {
            required: true,
            message: translate('Please input your email!'),
          },
          {
            type: 'email',
            message: translate('Please enter a valid email address!'),
          },
        ]}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          placeholder={'example@domain.com'}
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
            message: translate('Please input your password!'),
          },
          {
            min: 6,
            message: translate('Password must be at least 6 characters!'),
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder={translate('Create a password')}
          size="large"
        />
      </Form.Item>


      <Form.Item
        label={translate('Confirm Password')}
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          {
            required: true,
            message: translate('Please confirm your password!'),
          },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(translate('The two passwords do not match!')));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder={translate('Confirm your password')}
          size="large"
        />
      </Form.Item>


      <Form.Item>
        <Form.Item name="agreeTerms" valuePropName="checked" noStyle
          rules={[
            {
              validator: (_, value) =>
                value ? Promise.resolve() : Promise.reject(new Error(translate('You must agree to the terms and conditions'))),
            },
          ]}
        >
          <Checkbox>
            {translate('I agree to the Terms and Conditions')}
          </Checkbox>
        </Form.Item>
      </Form.Item>


      <Form.Item>
        <Form.Item name="newsletter" valuePropName="checked" noStyle>
          <Checkbox defaultChecked>
            {translate('Subscribe to newsletter')}
          </Checkbox>
        </Form.Item>
      </Form.Item>
    </div>
  );
}
