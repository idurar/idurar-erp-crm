import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useLanguage from '@/locale/useLanguage';
import { Form, Button, Select } from 'antd';

import { login } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import LoginForm from '@/forms/LoginForm';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const { Option } = Select;

const LoginPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [language, setLanguage] = useState('en');

  const onFinish = (values) => {
    dispatch(login({ loginData: values }));
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    // Here you can integrate your language change logic (i18n, redux, context, etc.)
    console.log('Selected language:', lang);
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess, navigate]);

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <div style={{ marginBottom: 16, textAlign: 'right' }}>
          <Select
            value={language}
            onChange={handleLanguageChange}
            style={{ width: 150 }}
          >
            <Option value="en">English</Option>
            <Option value="hi">Hindi</Option>
            <Option value="es">Spanish</Option>
            <Option value="fr">French</Option>
            <Option value="de">German</Option>
            <Option value="zh">Chinese</Option>
            <Option value="ja">Japanese</Option>
            <Option value="ar">Arabic</Option>
            <Option value="pt">Portuguese</Option>
            <Option value="ru">Russian</Option>
            <Option value="it">Italian</Option>
            <Option value="ko">Korean</Option>
            <Option value="bn">Bengali</Option>
            <Option value="tr">Turkish</Option>
            <Option value="vi">Vietnamese</Option>
          </Select>
        </div>

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
              block
            >
              {translate('Log in')}
            </Button>
          </Form.Item>
          <Form.Item>
            <Button
              type="default"
              className="register-form-button"
              size="large"
              block
              onClick={() => navigate('/register')}
            >
              {translate('Register')}
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    );
  };

  return <AuthModule authContent={<FormContainer />} AUTH_TITLE={translate('Sign in')} />;
};

export default LoginPage;
