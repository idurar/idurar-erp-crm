import { useEffect, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useLanguage from '@/locale/useLanguage';

import { Form, Button, message, Divider } from 'antd';

import { login, googleLogin } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import LoginForm from '@/forms/LoginForm';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const LoginPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const googleButtonRef = useRef(null);

  const onFinish = (values) => {
    dispatch(login({ loginData: values }));
  };

  const handleGoogleLogin = (response) => {
    if (response.credential) {
      dispatch(googleLogin({ token: response.credential }));
    } else {
      message.error('Google login failed');
    }
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess, navigate]);

  useEffect(() => {
    const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!googleClientId) {
      return;
    }

    const initializeGoogleSignIn = () => {
      try {
        if (window.google && googleButtonRef.current) {
          window.google.accounts.id.initialize({
            client_id: googleClientId,
            callback: handleGoogleLogin,
          });

          window.google.accounts.id.renderButton(googleButtonRef.current, {
            type: 'standard',
            size: 'large',
            text: 'signin_with',
            locale: 'en_US',
          });
        }
      } catch (error) {
        console.error('Google Sign-In initialization error:', error);
      }
    };

    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = initializeGoogleSignIn;
    script.onerror = () => {
      console.error('Failed to load Google Sign-In script');
    };
    document.head.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript && existingScript.parentNode) {
        existingScript.parentNode.removeChild(existingScript);
      }
    };
  }, []);

  const FormContainer = () => {
    const hasGoogleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={isLoading}
              size="large"
            >
              {translate('Log in')}
            </Button>
          </Form.Item>

          {hasGoogleClientId && (
            <>
              <Divider>{translate('Or')}</Divider>
              <div
                ref={googleButtonRef}
                style={{ display: 'flex', justifyContent: 'center', minHeight: '40px' }}
              />
            </>
          )}
        </Form>
      </Loading>
    );
  };

  return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Sign in" />;
};

export default LoginPage;
