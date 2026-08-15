import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';
import { Form, Button } from 'antd';
import { register } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import RegisterForm from '@/forms/RegisterForm';
import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const RegisterPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const onFinish = (values) => {
    // Remove confirm_password before sending to backend
    const { confirm_password, ...registerData } = values;
    dispatch(register({ registerData }));
  };

  useEffect(() => {
    if (isSuccess) {
      // Show success message and redirect to login after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    }
  }, [isSuccess, navigate]);

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <Form
          layout="vertical"
          name="register_form"
          className="login-form"
          onFinish={onFinish}
        >
          <RegisterForm userLocation={'US'} />
          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className="login-form-button"
              loading={isLoading}
              size="large"
            >
              {translate('register_now')}
            </Button>
          </Form.Item>
          <Form.Item style={{ textAlign: 'center', marginTop: '16px' }}>
            {translate('already have account')} <a href="/login">{translate('Log in')}</a>
          </Form.Item>
        </Form>
      </Loading>
    );
  };

  return <AuthModule authContent={<FormContainer />} AUTH_TITLE={translate('register')} />;
};

export default RegisterPage;
