import React from 'react';
import { Form, Input, Select, Button } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';
import { countryList } from '@/utils/countryList';

export default function RegisterForm({ userLocation, onSubmit }) {
  const translate = useLanguage();

  return (
    <Form layout="vertical" onFinish={onSubmit}>
      <Form.Item
        name="name"
        label={translate('name')}
        rules={[{ required: true, message: 'Name is required' }]}
      >
        <Input
          prefix={<UserOutlined />}
          size="large"
          placeholder={translate('name')}
        />
      </Form.Item>

      <Form.Item
        name="email"
        label={translate('email')}
        rules={[
          { required: true, message: 'Email is required' },
          { type: 'email', message: 'Enter valid email' },
        ]}
      >
        <Input
          prefix={<MailOutlined />}
          type="email"
          size="large"
          placeholder={translate('email')}
        />
      </Form.Item>

      <Form.Item
        name="password"
        label={translate('password')}
        rules={[{ required: true, message: 'Password is required' }]}
      >
        <Input.Password
          prefix={<LockOutlined />}
          size="large"
          placeholder={translate('password')}
        />
      </Form.Item>

      <Form.Item
        name="country"
        label={translate('country')}
        initialValue={userLocation}
        rules={[{ required: true, message: 'Country is required' }]}
      >
        <Select
          showSearch
          size="large"
          optionFilterProp="children"
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
        >
          {countryList.map((country) => (
            <Select.Option
              key={country.value}
              value={country.value}
              label={translate(country.label)}
            >
              {country.icon && country.icon + ' '}
              {translate(country.label)}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>

      {/* ✅ Submit button (ENTER works because of this) */}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          size="large"
          block
        >
          Register
        </Button>
      </Form.Item>
    </Form>
  );
}
