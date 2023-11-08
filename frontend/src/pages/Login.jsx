import { useEffect } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import useLanguage from '@/locale/useLanguage';

import { Form, Button, Layout, Col, Divider, Typography } from 'antd';

import { login } from '@/redux/auth/actions';
import { selectAuth } from '@/redux/auth/selectors';
import LoginForm from '@/forms/LoginForm';
import AuthLayout from '@/layout/AuthLayout';
import SideContent from '@/components/SideContent';
import SelectLanguage from '@/components/SelectLanguage';
import useIsMobile from '@/hooks/useIsMobile';

import logo from '@/style/images/logo.png';

const { Content } = Layout;
const { Title } = Typography;

const LoginPage = () => {
  const translate = useLanguage();
  const { isLoading, isSuccess } = useSelector(selectAuth);
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const dispatch = useDispatch();
  const onFinish = (values) => {
    dispatch(login({ loginData: values }));
  };

  useEffect(() => {
    if (isSuccess) navigate('/');
  }, [isSuccess]);
  return (
    <>
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
            padding: '140px 30px 30px',
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
            {isMobile ? <div className="space20"></div> : <div className="space50"></div>}
          </Col>
          <Title level={1}>{translate('Sign in')}</Title>

          <Divider />
          <div className="site-layout-content">
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
                {/* {translate('Or')} <a href="/register">{translate('register now!')}</a> */}
              </Form.Item>
            </Form>
          </div>
        </Content>
      </AuthLayout>
    </>
  );
};

export default LoginPage;
