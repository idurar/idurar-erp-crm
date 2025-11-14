import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useLanguage from '@/locale/useLanguage';

import { Form, Button, message } from 'antd';

import { login, googleLogin } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import LoginForm from '@/forms/LoginForm';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const LoginPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  // const size = useSize();

  const dispatch = useDispatch();
  const onFinish = (values) => {
    dispatch(login({ loginData: values }));
  };

  // handle credential response from Google Identity Services
  const handleCredentialResponse = (response) => {
    // response.credential is the ID token
    if (response && response.credential) {
      dispatch(googleLogin({ token: response.credential }));
    }
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);

  // Load Google Identity Services SDK and initialize
  useEffect(() => {
    const initGoogle = () => {
      if (!window.google || !window.google.accounts || !window.google.accounts.id) return;
      try {
        window.google.accounts.id.initialize({
          client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
          callback: handleCredentialResponse,
        });

        // Render a native Google button into hidden div so we can trigger it programmatically
        const container = document.getElementById('google-render-button');
        if (container && container.childElementCount === 0) {
          window.google.accounts.id.renderButton(container, { theme: 'outline', size: 'large' });
        }
      } catch (err) {
        // ignore initialization errors; user may not have provided client id
      }
    };

    // append script if not present
    if (!document.getElementById('gsi-client')) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.id = 'gsi-client';
      script.onload = initGoogle;
      document.body.appendChild(script);
    } else {
      initGoogle();
    }
  }, []);

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <Form
          layout="vertical"
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
            email:'admin@admin.com',
            password:'admin123',
          }}
          onFinish={onFinish}
        >
          <LoginForm />
          {/* Hidden div for Google's rendered button (used to trigger the SDK) */}
          <div id="google-render-button" style={{ display: 'none' }} />
          <Form.Item style={{ textAlign: 'center', marginTop: 20 }}>
            <Button
              type="primary"
              htmlType="button"
              size="large"
              onClick={() => {
                console.log('Google sign-in button clicked');
                message.loading({ content: 'Signing in with Google...', key: 'googleSignIn' });
                const gbtn = document.querySelector('#google-render-button button');
                if (gbtn) {
                  gbtn.click();
                } else if (window.google && window.google.accounts && window.google.accounts.id) {
                  // fallback to prompt
                  window.google.accounts.id.prompt();
                } else {
                  // SDK not available — fallback to mock token for local demo against mock_dev_server
                  dispatch(googleLogin({ token: 'mock-token' }));
                }
                // Clear loading; actual success will navigate away
                setTimeout(() => {
                  message.success({ content: 'Sign-in attempted', key: 'googleSignIn', duration: 1 });
                }, 1000);
              }}
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}
              icon={
                <svg width="18" height="18" viewBox="0 0 533.5 544.3" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <path fill="#4285f4" d="M533.5 278.4c0-17.4-1.6-34.2-4.7-50.4H272v95.4h146.9c-6.3 34-25.4 62.9-54.1 82.2v68.1h87.4c51.2-47.1 80.3-116.8 80.3-195.3z"/>
                  <path fill="#34a853" d="M272 544.3c73.6 0 135.4-24.4 180.6-66.4l-87.4-68.1c-24.3 16.3-55.2 25.9-93.2 25.9-71.7 0-132.5-48.4-154.2-113.3H31.6v71.2C76.9 480.8 168 544.3 272 544.3z"/>
                  <path fill="#fbbc04" d="M117.7 322.4c-8.6-25.9-8.6-53.6 0-79.5V171.7H31.6c-38.7 76.6-38.7 167.3 0 243.9l86.1-71.2z"/>
                  <path fill="#ea4335" d="M272 107.7c39.9 0 75.9 13.7 104.2 40.5l78.1-78.1C407.2 24.9 344.2 0 272 0 168 0 76.9 63.5 31.6 171.7l86.1 71.2C139.5 156.1 200.3 107.7 272 107.7z"/>
                </svg>
              }
            >
              {translate('Sign in with Google')}
            </Button>
          </Form.Item>
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
        </Form>
      </Loading>
    );
  };

  return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Sign in" />;
};

export default LoginPage;
