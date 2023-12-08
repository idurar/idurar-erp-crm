import { useNavigate } from 'react-router-dom';

import AuthLayout from '@/layout/AuthLayout';
import SelectLanguage from '@/components/SelectLanguage';

import logo from '@/style/images/idurar-crm-erp.svg';

import { Form, Button, Layout, Col, Divider, Typography } from 'antd';
import useOnFetch from '@/hooks/useOnFetch';
import { request } from '@/request';

import ForgetPasswordForm from '@/forms/ForgetPasswordForm';

import SideContent from '@/components/SideContent';

import useLanguage from '@/locale/useLanguage';

import Loading from '@/components/Loading';

const { Content } = Layout;
const { Title } = Typography;

const ForgetPassword = () => {
  const translate = useLanguage();

  const navigate = useNavigate();

  const { onFetch, isSuccess, isLoading } = useOnFetch();

  async function postData(data) {
    return await request.post({ entity: 'forgetpassword', jsonData: data });
  }

  const onFinish = (values) => {
    const callback = postData(values);
    onFetch(callback);
  };

  if (!isSuccess) {
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
          <Title level={1}>{translate('Forget Password')}</Title>

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
                <ForgetPasswordForm />
                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="login-form-button"
                    size="large"
                  >
                    {translate('Register')}
                  </Button>
                  {translate('Or')} <a href="/login"> {translate('already have account Login')} </a>
                </Form.Item>
              </Form>
            </Loading>
          </div>
        </Content>
      </AuthLayout>
    );
  } else {
    return (
      <Result
        status="success"
        title={translate('Password Reset in progress')}
        subTitle={translate('Check your email address , to reset your password')}
        extra={
          <Button
            type="primary"
            onClick={() => {
              navigate(`/login`);
            }}
          >
            {translate('Back')}
          </Button>
        }
      ></Result>
    );
  }
};

export default ForgetPassword;
