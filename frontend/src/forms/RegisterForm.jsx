import React, { useState } from 'react';
import { Form, Input, Progress } from 'antd';
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function RegisterForm() {
  const translate = useLanguage();
  const [passwordStrength,setPasswordStrength]=useState(0)

  const calculatePasswordStrength = password => {
    let strength = 0;
    // Add points for each criteria met
    strength += /[A-Z]/.test(password) ? 20 : 0; // Uppercase letters
    strength += /[a-z]/.test(password) ? 20 : 0; // Lowercase letters
    strength += /[0-9]/.test(password) ? 20 : 0; // Numbers
    strength += /[^A-Za-z0-9]/.test(password) ? 20 : 0; // Special characters
    strength += password.length >= 8 ? 20 : 0; // Length

    return strength;
  };

  const handlePasswordChange = e => {
    const password = e.target.value;
    const strength = calculatePasswordStrength(password);
    setPasswordStrength(strength);
  };
  const getTrailColor = () => {
    if (passwordStrength >= 80) {
      return '#95DE64';
    } else if (passwordStrength >= 60) {
      return '#1890FF';
    } else if (passwordStrength >= 40) {
      return '#FFA940';
    } else {
      return '#FF4D4F';
    }
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
      <Form.Item
        name="password"
        label={translate('password')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <div> {
        //added this div because Form.item must have a single child element.
              }
        <Input.Password onChange={handlePasswordChange} prefix={<LockOutlined className="site-form-item-icon" />} size="large" />
        <Progress percent={passwordStrength} status="active" strokeColor={getTrailColor()} showInfo={false}/>

        </div>
      
      </Form.Item>
      <Form.Item
        name="confirm_password"
        label={translate('confirm_password')}
        rules={[
          {
            required: true,
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
      </Form.Item>
    </>
  );
}
