import React from 'react';
import { useDispatch } from 'react-redux';
import { Form, Button, Layout, Col, Divider, Typography } from 'antd';
import { register } from '@/redux/auth/actions';
import RegisterForm from '@/forms/RegisterForm';
import AuthLayout from '@/layout/AuthLayout';

import logo from '@/style/images/logo.png';
import SideContent from '@/components/SideContent';

import useLanguage from '@/locale/useLanguage';

const { Content } = Layout;
const { Title } = Typography;

const RegisterPage = () => {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const onFinish = (values) => {
    // TODO: Set the role on register to admin do backend call to get the
    // admin rol this is set as default rol on backend setup
    dispatch(register({ registerData: values }));
  };
  return (
    <>
      <AuthLayout sideContent={<SideContent />}>
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
          <Title level={1}>{translate('Sign up')}</Title>

          <Divider />
          <div className="site-layout-content">
            <Form
              name="normal_register"
              className="register-form"
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
          </div>
        </Content>
      </AuthLayout>
    </>
  );
};

export default RegisterPage;
