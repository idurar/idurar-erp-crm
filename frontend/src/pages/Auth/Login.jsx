import React, { useState } from "react";
import { Form, Input, Button, Checkbox } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";


const Login = () => {
  const [loading, setLoading] = useState(false);

  const onFinish = (values) => {
    console.log("Login values:", values);
    setLoading(true);
    setTimeout(() => setLoading(false), 800);
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", alignItems: "center" }}>
      <div style={{ flex: 1, padding: 50 }}>
        <img src="/logo.png" alt="Idurar" style={{ width: 120 }} />
        <h2>Free Open Source ERP / CRM</h2>
        <p>Accounting / Invoicing / Quote App based on Node.js · React.js · Ant Design</p>
      </div>

      <div style={{ width: 420, padding: 50 }}>
        <h1>Sign In</h1>
        <Form name="login" initialValues={{ remember: true }} onFinish={onFinish}>
          <Form.Item name="email" rules={[{ required: true, message: "Please input your Email!" }]}>
            <Input prefix={<UserOutlined />} placeholder="admin@admin.com" />
          </Form.Item>

          <Form.Item name="password" rules={[{ required: true, message: "Please input your Password!" }]}>
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Form.Item name="remember" valuePropName="checked" noStyle>
              <Checkbox>Remember Me</Checkbox>
            </Form.Item>
            <a style={{ float: "right" }} href="#">Forgot Password</a>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} style={{ width: "100%", backgroundColor: "#2C8C8C", borderColor: "#2C8C8C" }}>
              Log In
            </Button>

            <div style={{ marginTop: 12, textAlign: "center" }}>
             
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Login;

