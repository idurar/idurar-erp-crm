import React, { useState, useEffect, useLayoutEffect } from 'react';
import { Form, Input, Select } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';
import { countryList } from '@/utils/countryList';

export default function RegisterForm({ userLocation }) {
  const translate = useLanguage();

  // Password validation function
  const validatePassword = (_, value) => {
    if (!value) {
      return Promise.reject(new Error('Password is required!'));
    }
    
    if (value.length < 8) {
      return Promise.reject(new Error('Password must be at least 8 characters long!'));
    }
    
    // Check for uppercase letter
    if (!/[A-Z]/.test(value)) {
      return Promise.reject(new Error('Password must contain at least one uppercase letter!'));
    }
    
    // Check for lowercase letter
    if (!/[a-z]/.test(value)) {
      return Promise.reject(new Error('Password must contain at least one lowercase letter!'));
    }
    
    // Check for number
    if (!/\d/.test(value)) {
      return Promise.reject(new Error('Password must contain at least one number!'));
    }
    
    // Check for special character
    if (!/[@$!%*?&]/.test(value)) {
      return Promise.reject(new Error('Password must contain at least one special character (@$!%*?&)!'));
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
            message: 'Please enter your name!',
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
            message: 'Please enter your email!',
          },
          {
            type: 'email',
            message: 'Please enter a valid email address!',
          },
        ]}
      >
        <Input
          prefix={<MailOutlined className="site-form-item-icon" />}
          type="email"
          size="large"
        />
      </Form.Item>
      
      <Form.Item
        name="password"
        label={translate('password')}
        rules={[
          {
            required: true,
            message: 'Please enter your password!',
          },
          {
            validator: validatePassword,
          },
        ]}
        hasFeedback
      >
        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} size="large" />
      </Form.Item>

      {/* Optional: Uncomment this if you want password confirmation */}
      {/* <Form.Item
        name="confirm_password"
        label={translate('confirm_password')}
        rules={[
          {
            required: true,
            message: 'Please confirm your password!',
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
        <Input.Password prefix={<LockOutlined className="site-form-item-icon" />} size="large" />
      </Form.Item> */}
      
      <Form.Item
        label={translate('country')}
        name="country"
        rules={[
          {
            required: true,
            message: 'Please select your country!',
          },
        ]}
        initialValue={userLocation}
      >
        <Select
          showSearch
          defaultOpen={false}
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
          }
          style={{
            width: '100%',
          }}
          size="large"
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