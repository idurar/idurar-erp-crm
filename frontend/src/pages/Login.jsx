import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // Add framer-motion to your dependencies

import useLanguage from '@/locale/useLanguage';

import { Form, Button, Typography, message } from 'antd';

import { login } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import LoginForm from '@/forms/LoginForm';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

// Assuming you have a company logo

const { Title } = Typography;

const LoginPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess, error } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [animationComplete, setAnimationComplete] = useState(false);

  // Login error handling
  useEffect(() => {
    if (error) {
      message.error(translate('Login failed. Please check your credentials.'));
    }
  }, [error]);

  const onFinish = (values) => {
    dispatch(login({ loginData: values }));
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{
            opacity: animationComplete ? 1 : 0,
            scale: animationComplete ? 1 : 0.9,
          }}
          transition={{
            duration: 0.5,
            ease: 'easeInOut',
          }}
          style={{
            maxWidth: 400,
            width: '100%',
            margin: '0 auto',
            padding: '40px 20px',
            borderRadius: 12,
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.08)',
            background: 'white',
            position: 'relative',
          }}
        >
          {/* Centered Logo */}
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{
              opacity: animationComplete ? 1 : 0,
              y: animationComplete ? 0 : -50,
            }}
            transition={{
              duration: 0.6,
              delay: 0.2,
              ease: 'easeOut',
            }}
            style={{
              textAlign: 'center',
              marginBottom: 24,
              position: 'absolute',
              top: -60,
              left: 0,
              right: 0,
              display: 'flex',
              justifyContent: 'center',
            }}
          ></motion.div>

          <div style={{ marginTop: 60 }}>
            <Form
              layout="vertical"
              name="normal_login"
              className="login-form"
              initialValues={{ remember: true }}
              onFinish={onFinish}
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{
                  opacity: animationComplete ? 1 : 0,
                  y: animationComplete ? 0 : 20,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.4,
                  ease: 'easeOut',
                }}
              >
                <LoginForm />

                <Form.Item>
                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      className="login-form-button"
                      loading={isLoading}
                      size="large"
                      block
                      style={{
                        marginTop: 16,
                        borderRadius: 8,
                        height: 48,
                        fontWeight: 600,
                      }}
                    >
                      {translate('Log in')}
                    </Button>
                  </motion.div>
                </Form.Item>
              </motion.div>
            </Form>
          </div>
        </motion.div>
      </Loading>
    );
  };

  // Trigger animations after initial render
  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimationComplete(true);
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  return (
    <motion.div
      initial={{ backgroundColor: '#ffffff' }}
      animate={{
        backgroundColor: animationComplete ? '#f0f2f5' : '#ffffff',
      }}
      transition={{ duration: 0.5 }}
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <AuthModule authContent={<FormContainer />} AUTH_TITLE="Sign in" />
    </motion.div>
  );
};

export default LoginPage;
