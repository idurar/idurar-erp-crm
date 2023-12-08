import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';

import { resetPassword } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import AuthLayout from '@/layout/AuthLayout';
import SelectLanguage from '@/components/SelectLanguage';

import logo from '@/style/images/idurar-crm-erp.svg';

import { Form, Button, Layout, Col, Divider, Typography } from 'antd';

import ResetPasswordForm from '@/forms/ResetPasswordForm';
import SideContent from '@/components/SideContent';

import useLanguage from '@/locale/useLanguage';

import Loading from '@/components/Loading';

const { Content } = Layout;
const { Title } = Typography;

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

  return (
    <AuthLayout sideContent={<SideContent />}>
      <Content
        style={{
          padding: '10px 20px',
        }}
      >
        <SelectLanguage />
      </Content>
      <Content
        style={{
          padding: '200px 30px 30px',
          maxWidth: '440px',
          margin: '0 auto',
        }}
      >
        <Col xs={{ span: 24 }} sm={{ span: 24 }} md={{ span: 0 }} span={0}>
          <img
            src={logo}
            alt="Logo"
            style={{
              margin: '-70px auto 40px',
              display: 'block',
            }}
          />
          <div className="space50"></div>
        </Col>
        <Title level={1}>{translate('Reset Password')}</Title>

        <Divider />
        <div className="site-layout-content">
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
        </div>
      </Content>
    </AuthLayout>
  );
};

export default ResetPassword;
