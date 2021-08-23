import React from "react";
import { useDispatch, useSelector } from "react-redux";

import { Form, Input, Button, Checkbox, Layout, Row, Col, Divider } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

import { login } from "@/redux/auth/actions";
import { selectAuth } from "@/redux/auth/selectors";
import LoginForm from "@/forms/LoginForm";
const { Content, Footer } = Layout;

const LoginPage = () => {
  const { loading: isLoading } = useSelector(selectAuth);

  const dispatch = useDispatch();
  const onFinish = (values) => {
    dispatch(login(values));
  };
  return (
    <>
      <Layout className="layout">
        <Row>
          <Col span={12} offset={6}>
            <Content
              style={{
                padding: "150px 0 180px",
                maxWidth: "460px",
                margin: "0 auto",
              }}
            >
              <h1>Login</h1>

              <Divider />
              <div className="site-layout-content">
                {" "}
                <Form
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
                      Log in
                    </Button>
                    Or <a href="">register now!</a>
                  </Form.Item>
                </Form>
              </div>
            </Content>
          </Col>
        </Row>

        <Footer style={{ textAlign: "center" }}>
          Open Source CRM based on AntD & React ©2020 Created by Salah Eddine
          Lalami
        </Footer>
      </Layout>
    </>
  );
};

export default LoginPage;
