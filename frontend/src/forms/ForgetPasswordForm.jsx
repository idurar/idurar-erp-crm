import React from 'react';
import { Form, Input } from 'antd';
import { MailOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

// import useLanguage from '@/locale/useLanguage';

export default function ForgetPasswordForm() {
  const translate=useLanguage()
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
        placeholder={translate('email')}
        size="large"
      />
    </Form.Item>
  );
}
