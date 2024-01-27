import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { register } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import { Form, Button, Result } from 'antd';
import RegisterForm from '@/forms/RegisterForm';
import useLanguage from '@/locale/useLanguage';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const RegisterPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  // const size = useSize();

  const dispatch = useDispatch();
  const onFinish = (values) => {
    dispatch(register({ registerData: values }));
  };

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <Form
          layout="vertical"
          name="signup"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <RegisterForm />
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" size="large">
              {translate('Register')}
            </Button>
            {translate('Or')} <a href="/login"> {translate('already have account Login')} </a>
          </Form.Item>
        </Form>
      </Loading>
    );
  };

  if (!isSuccess) {
    return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Sign up" />;
  } else {
    return (
      <Result
        status="info"
        title={translate('Verify your account')}
        subTitle={translate('Check your email address to verify your account')}
        // extra={
        //   <Button
        //     type="primary"
        //     onClick={() => {
        //       navigate(`/login`);
        //     }}
        //   >
        //     {translate('Login')}
        //   </Button>
        // }
      ></Result>
    );
  }
};

export default RegisterPage;
