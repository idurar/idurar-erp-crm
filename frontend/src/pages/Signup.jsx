import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, message } from 'antd';
import useLanguage from '@/locale/useLanguage';

import { register } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const SignupPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess, error } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  // Handle manual email registration
  const onFinish = async (values) => {
    try {
      const registerData = {
        email: values.email,
        registeredAt: new Date().toISOString(),
      };

      await dispatch(register({ registerData }));
      message.success(translate('Email registered successfully!'));
      navigate('/'); // redirect after registration
    } catch (err) {
      console.error('Registration error:', err);
      message.error(translate('Registration failed. Please try again.'));
    }
  };

  // Handle Google signup (optional)
  const handleGoogleSignup = async (credentialResponse) => {
    try {
      if (!credentialResponse?.credential) return;

      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const decodedToken = JSON.parse(atob(base64));

      const googleData = {
        email: decodedToken.email,
        name: decodedToken.name,
        picture: decodedToken.picture,
        isGoogleSignup: true,
        googleToken: credentialResponse.credential,
      };

      await dispatch(register({ registerData: googleData }));
      message.success(translate('Registered with Google!'));
      navigate('/');
    } catch (err) {
      console.error('Google signup error:', err);
      message.error(translate('Google signup failed. Please try again.'));
    }
  };

  useEffect(() => {
    if (isSuccess) {
      message.success(translate('Registration successful!'));
      navigate('/');
    }
  }, [isSuccess, navigate, translate]);

  useEffect(() => {
    if (error) {
      message.error(error || translate('Registration failed. Please try again.'));
    }
  }, [error, translate]);

  // Form UI
  const FormContainer = () => (
    <Loading isLoading={isLoading}>
      <div style={{ maxWidth: 400, margin: '0 auto', padding: '20px' }}>
        <Form
          form={form}
          layout="vertical"
          name="signup"
          onFinish={onFinish}
          scrollToFirstError
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

          {/* Register Button */}
          <Form.Item style={{ marginBottom: 24 }}>
            <Button
              type="primary"
              htmlType="submit"
              loading={isLoading}
              size="large"
              block
              style={{
                height: '48px',
                fontSize: '16px',
                fontWeight: '500',
                borderRadius: '6px',
              }}
            >
              {translate('Register')}
            </Button>
          </Form.Item>

          {/* Optional Google Signup Button */}
          {/*
          <Form.Item>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <GoogleLogin
                onSuccess={handleGoogleSignup}
                onError={() => console.log('Google Signup Failed')}
              />
            </div>
          </Form.Item>
          */}

          {/* Login link */}
          <div
            style={{
              textAlign: 'center',
              marginTop: '24px',
              borderTop: '1px solid #f0f0f0',
              paddingTop: '24px',
            }}
          >
            <span style={{ marginRight: '8px' }}>{translate('Already have an account?')}</span>
            <Button
              type="link"
              onClick={() => navigate('/login')}
              style={{ padding: '0', fontWeight: '500' }}
            >
              {translate('Log in')}
            </Button>
          </div>
        </Form>
      </div>
    </Loading>
  );

  return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Sign up" />;
};

export default SignupPage;
