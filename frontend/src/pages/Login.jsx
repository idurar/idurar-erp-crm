import { useEffect, useState, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useLanguage from '@/locale/useLanguage';

import { Form, Button, Input } from 'antd';

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
  
  // Add state for CAPTCHA
  const [captcha, setCaptcha] = useState('');
  const [userCaptcha, setUserCaptcha] = useState('');
  
  // Add ref for CAPTCHA input
  const captchaInputRef = useRef(null);

  // Generate a random CAPTCHA on component mount
  useEffect(() => {
    const num1 = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
    const num2 = Math.floor(Math.random() * 5) + 1; // Random number between 1 and 5
    setCaptcha(`${num1} + ${num2}`);
  }, []);

  const onFinish = (values) => {
    const [num1, num2] = captcha.split(' + ').map(Number);
    const correctAnswer = (num1 + num2) % 10; // Ensure the result is a single digit
    if (parseInt(userCaptcha, 10) === correctAnswer) {
      dispatch(login({ loginData: values }));
    } else {
      alert(translate('CAPTCHA verification failed. Please try again.'));
    }
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <Form
          layout="vertical"
          name="normal_login"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <LoginForm />
          
          {/* Add CAPTCHA verification */}
          <Form.Item
            label={translate('CAPTCHA')}
            extra={translate('Please enter the characters you see below')}
          >
            <div 
              style={{ 
                marginBottom: '10px', 
                fontFamily: 'monospace', 
                fontSize: '18px', 
                letterSpacing: '5px',
                userSelect: 'none',
                WebkitUserSelect: 'none',
                MozUserSelect: 'none',
                msUserSelect: 'none'
              }}
            >
              {captcha}
            </div>
            <Input
              ref={captchaInputRef}
              value={userCaptcha}
              onChange={(e) => setUserCaptcha(e.target.value)}
              placeholder={translate('Enter CAPTCHA')}
            />
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
            <Button
              type="primary"
              htmlType="button"
              className="login-form-button"
              loading={isLoading}
              size="large"
              onClick={() => { navigate('/register') }}
            >
              {translate('Register')}
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    );
  };

  return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Sign in" />;
};

export default LoginPage;
