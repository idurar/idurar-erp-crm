import React from 'react';
import { Form, Input } from 'antd';
import { LockOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function ResetPasswordForm() {
  const translate = useLanguage();

  return (
    <>
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
          placeholder={translate('Password')}
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
              return Promise.reject(
                new Error(translate('The two passwords that you entered do not match'))
              );
            },
          }),
        ]}
        hasFeedback
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder={translate('Confirm password')}
          size="large"
        />
      </Form.Item>
    </>
  );
}
