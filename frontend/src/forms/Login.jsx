// File: frontend/src/pages/Login.jsx
// Complete Login page with Register link

import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Form, Input, Button, Checkbox, Row, Col, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';
import { login } from '@/redux/auth/actions';
import AuthModule from '@/modules/AuthModule';

const FormContainer = () => {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const { email, password, remember } = values;
      dispatch(login({ loginData: { email, password, remember } }));
    } catch (error) {
      message.error(translate('Login failed. Please try again.'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      name="login"
      initialValues={{
        remember: true,
      }}
      onFinish={onFinish}
      layout="vertical"
    >
      <Form.Item
        label={translate('Email')}
        name="email"
        rules={[
          {
            required: true,
            message: translate('Please input your email!'),
          },
          {
            type: 'email',
            message: translate('Please enter a valid email!'),
          },
        ]}
      >
        <Input
          prefix={<UserOutlined className="site-form-item-icon" />}
          placeholder={translate('Email')}
          size="large"
        />
      </Form.Item>

      <Form.Item
        label={translate('Password')}
        name="password"
        rules={[
          {
            required: true,
            message: translate('Please input your password!'),
          },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="site-form-item-icon" />}
          placeholder={translate('Password')}
          size="large"
        />
      </Form.Item>

      <Form.Item>
        <Row justify="space-between" align="middle">
          <Col>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>{translate('Remember Me')}</Checkbox>
            </Form.Item>
          </Col>
          <Col>
            <Link to="/forgetpassword" style={{ color: '#1890ff' }}>
              {translate('Forgot Password')}
            </Link>
          </Col>
        </Row>
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          size="large"
          block
          style={{
            backgroundColor: '#48a9a6',
            borderColor: '#48a9a6',
            height: 48,
          }}
        >
          {translate('Log In')}
        </Button>
      </Form.Item>

      {/* ============================================ */}
      {/* REGISTER LINK - THIS IS THE NEW SECTION      */}
      {/* ============================================ */}
      <Form.Item style={{ textAlign: 'center', marginTop: 20, marginBottom: 0 }}>
        <span style={{ color: '#666' }}>
          {translate("Don't have an account?")}
        </span>
        {' '}
        <Link
          to="/register"
          style={{
            color: '#48a9a6',
            fontWeight: 600,
            textDecoration: 'none',
          }}
        >
          {translate('Sign Up')}
        </Link>
      </Form.Item>
      {/* ============================================ */}
      {/* END OF REGISTER LINK SECTION                 */}
      {/* ============================================ */}
    </Form>
  );
};

export default function LoginPage() {
  return (
    <AuthModule>
      <FormContainer />
    </AuthModule>
  );
}