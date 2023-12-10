import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { resetPassword } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';

import { Form, Button } from 'antd';

import ResetPasswordForm from '@/forms/ResetPasswordForm';

import useLanguage from '@/locale/useLanguage';

import Loading from '@/components/Loading';
import AuthModule from '@/modules/AuthModule';

const ResetPassword = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  const { userId, resetToken } = useParams();

  const dispatch = useDispatch();
  const onFinish = (values) => {
    dispatch(
      resetPassword({
        resetPasswordData: {
          password: values.password,
          userId,
          resetToken,
        },
      })
    );
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);

  const FormContainer = () => {
    return (
      <Loading isLoading={isLoading}>
        <Form
          name="signup"
          className="login-form"
          initialValues={{
            remember: true,
          }}
          onFinish={onFinish}
        >
          <ResetPasswordForm />
          <Form.Item>
            <Button type="primary" htmlType="submit" className="login-form-button" size="large">
              {translate('update password')}
            </Button>
            {translate('Or')} <a href="/login"> {translate('already have account Login')} </a>
          </Form.Item>
        </Form>
      </Loading>
    );
  };
  return <AuthModule authContent={<FormContainer />} AUTH_TITLE="Reset Password" />;
};

export default ResetPassword;
