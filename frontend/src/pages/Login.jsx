// frontend/src/pages/Login.jsx
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Row, Col } from 'antd';

import useLanguage from '@/locale/useLanguage';

import { Form, Button } from 'antd';

import { login } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import LoginForm from '@/forms/LoginForm';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const LoginPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const onFinish = (values) => {
    dispatch(login({ loginData: values }));
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess, navigate]);

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <Form
          layout="vertical"
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
            email: 'admin@admin.com',
            password: 'admin123',
          }}
          onFinish={onFinish}
        >
          <LoginForm />
          <Form.Item style={{ marginTop: 16 }}>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={isLoading}
              size="large"
              block
            >
              {translate('Log in')}
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    );
  };

  // Use Ant Design Row/Col + a simple wrapper to center on large screens
  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        background: 'var(--app-background, #fafafa)',
      }}
    >
      <Row
        justify="center"
        align="middle"
        style={{
          width: '100%',
          maxWidth: 1200, // container width on very large screens
          margin: '0 auto',
          background: '#fff',
          borderRadius: 12,
          boxShadow: '0 6px 20px rgba(0,0,0,0.06)',
          overflow: 'hidden',
        }}
      >
        {/* Left explanatory/branding column */}
        <Col
          xs={0}
          sm={0}
          md={10}
          lg={12}
          style={{
            padding: '64px 48px',
            background: '#ffffff',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          <img
            src="/images/idurar-logo.svg"
            alt="iDurar CRM/ERP"
            style={{ width: 200, maxWidth: '80%', marginBottom: 18 }}
          />
          <h2 style={{ margin: '8px 0 12px', color: '#2b6cb0' }}>
            Free Open Source ERP / CRM
          </h2>
          <p style={{ color: '#6b7280', lineHeight: 1.6 }}>
            Accounting · Invoicing · Quote App based on Node.js + React · Ant Design
          </p>
        </Col>

        {/* Right login column (collapses to full width on small screens) */}
        <Col
          xs={24}
          sm={24}
          md={14}
          lg={12}
          style={{
            padding: '48px 40px',
            background: '#fff',
          }}
        >
          <AuthModule authContent={<FormContainer />} AUTH_TITLE="Sign in" />
        </Col>
      </Row>
    </div>
  );
};

export default LoginPage;
