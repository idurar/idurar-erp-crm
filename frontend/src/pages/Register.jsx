import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useLanguage from '@/locale/useLanguage';

import { Form, Button } from 'antd';

import { login } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';
import RegisterForm from '@/forms/RegisterForm';


const RegisterPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  // const size = useSize();

  const dispatch = useDispatch();
 

  useEffect(() => {
    if (isSuccess) navigate('/Login');
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
          <RegisterForm/>
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="register-form-button"
              loading={isLoading}
              size="large"
            >
              {translate('Register in')}
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    );
  };

  return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Sign Up" />;
};

export default RegisterPage;
