import React from 'react';
import { Form, Input } from 'antd';
import { MailOutlined } from '@ant-design/icons';

// import useLanguage from '@/locale/useLanguage';

export default function ForgetPasswordForm() {
  return (
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
        prefix={<MailOutlined className="site-form-item-icon" />}
        type="email"
        placeholder="Email"
        size="large"
      />
    </Form.Item>
  );
}
