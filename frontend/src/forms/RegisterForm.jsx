import React from 'react';
import { Form, Input, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';
import { countryList } from '@/utils/countryList';

// 🔥 Strong password validation regex
const strongPasswordRegex =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;

export default function RegisterForm({ userLocation }) {
  const translate = useLanguage();

  // custom validator function for AntD field
  const validateStrongPassword = (_, value) => {
    if (!value) return Promise.resolve(); // required rule already covers empty value
    if (!strongPasswordRegex.test(value)) {
      return Promise.reject(
        'Password must be at least 8 characters and include uppercase, lowercase, number and special character.'
      );
    }
    return Promise.resolve();
  };

  return (
    <>
      <Form.Item
        name="name"
        label={translate('name')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input prefix={<UserOutlined className="site-form-item-icon" />} size="large" />
      </Form.Item>

      <Form.Item
        name="email"
        label={translate('email')}
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
          prefix={<MailOutlined className="site-form-item-icon" />}
          type="email"
          size="large"
        />
      </Form.Item>

      {/* 🔥 Updated password field with validation */}
      <Form.Item
        name="password"
        label={translate('password')}
        rules={[
          { required: true, message: translate('password') + ' ' + translate('is required') },
          { validator: validateStrongPassword },
        ]}
        hasFeedback
      >
        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} size="large" />
      </Form.Item>

      {/* Optional confirm password (recommended for UX) */}
      <Form.Item
        name="confirm_password"
        label={translate('confirm_password')}
        dependencies={['password']}
        rules={[
          { required: true, message: translate('confirm_password') + ' ' + translate('is required') },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match'));
            },
          }),
        ]}
        hasFeedback
      >
        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} size="large" />
      </Form.Item>

      <Form.Item
        label={translate('country')}
        name="country"
        rules={[
          {
            required: true,
          },
        ]}
        initialValue={userLocation}
      >
        <Select
          showSearch
          optionFilterProp="children"
          size="large"
          style={{ width: '100%' }}
        >
          {countryList.map((language) => (
            <Select.Option
              key={language.value}
              value={language.value}
              label={translate(language.label)}
            >
              {language?.icon && language?.icon + ' '}
              {translate(language.label)}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
    </>
  );
}
