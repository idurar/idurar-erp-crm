import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import useLanguage from '@/locale/useLanguage';

import { Form, Button, Input, Modal, message } from 'antd';
import { login, register } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import LoginForm from '@/forms/LoginForm';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const LoginPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess, error } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [registerForm] = Form.useForm();

  // Regular login
  const onFinish = (values) => {
    dispatch(login({ loginData: values }));
  };

  // Handle Google Login
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) {
        console.error('No credential received from Google');
        return;
      }

      const tokenParts = credentialResponse.credential.split('.');
      if (tokenParts.length !== 3) {
        throw new Error('Invalid token format');
      }

      const decodedToken = JSON.parse(atob(tokenParts[1]));
      const expirationTime = decodedToken.exp * 1000;

      if (Date.now() >= expirationTime) throw new Error('Google token has expired');

      dispatch(login({
        loginData: {
          googleToken: credentialResponse.credential,
          email: decodedToken.email,
          name: decodedToken.name,
          picture: decodedToken.picture,
          isGoogleLogin: true,
        },
      }));
    } catch (error) {
      console.error('Google Login Error:', error);
    }
  };

  // Handle Register form submission
  const onRegisterFinish = async (values) => {
    try {
      const registerData = {
        email: values.email,
        registeredAt: new Date().toISOString(),
      };

      await dispatch(register({ registerData }));
      message.success(translate('Email registered successfully!'));
      setIsRegisterModalOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      message.error(translate('Registration failed. Please try again.'));
    }
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);

  // Main login + register form container
  const FormContainer = () => (
    <Loading isLoading={isLoading}>
      <Form
        layout="vertical"
        name="normal_login"
        className="login-form"
        onFinish={onFinish}
      >
        <LoginForm />

        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            loading={isLoading}
            size="large"
            block
            style={{ marginBottom: '15px' }}
          >
            {translate('Log in')}
          </Button>
        </Form.Item>

        <div style={{ textAlign: 'center', margin: '15px 0' }}>
          <span style={{ color: '#999' }}>{translate('Or')}</span>
        </div>

        {/* Google Login */}
        <Form.Item>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={(error) => console.error('Google Login Failed:', error)}
              useOneTap
              theme="filled_blue"
              size="large"
              text="continue_with"
              shape="rectangular"
              width="100%"
            />
          </div>
        </Form.Item>

        {/* Error message */}
        {error && (
          <div style={{ color: '#ff4d4f', textAlign: 'center', marginBottom: '15px' }}>
            {error}
          </div>
        )}

        {/* Register Button */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '24px',
            borderTop: '1px solid #f0f0f0',
            paddingTop: '24px',
          }}
        >
          <span style={{ marginRight: '8px' }}>
            {translate("Don't have an account?")}
          </span>
          <Button
            type="link"
            onClick={() => setIsRegisterModalOpen(true)}
            style={{ padding: '0', fontWeight: '500' }}
          >
            {translate('Register')}
          </Button>
        </div>
      </Form>

      {/* Register Modal */}
      <Modal
        title={translate('Register')}
        open={isRegisterModalOpen}
        onCancel={() => setIsRegisterModalOpen(false)}
        footer={null}
      >
        <Form
          form={registerForm}
          layout="vertical"
          name="register_form"
          onFinish={onRegisterFinish}
        >
          <Form.Item
            label={translate('Email')}
            name="email"
            rules={[
              { required: true, message: translate('Please input your email!') },
              { type: 'email', message: translate('Please enter a valid email!') },
            ]}
            hasFeedback
          >
            <Input
              placeholder={translate('Enter your email')}
              autoComplete="email"
              size="large"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              size="large"
              block
            >
              {translate('Register')}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </Loading>
  );

  return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Sign in" />;
};

export default LoginPage;
