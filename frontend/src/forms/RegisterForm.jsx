import React from "react";
import { Form, Input, Button, message } from "antd";
import axios from "axios";

const Register = () => {
  const [form] = Form.useForm();

  const onFinish = async (values) => {
    try {
      const res = await axios.post("http://localhost:5000/api/auth/register", values);
      if (res.data.success) {
        message.success("Registration successful!");
        form.resetFields();
      } else {
        message.error(res.data.message || "Registration failed");
      }
    } catch (err) {
      message.error(err.response?.data?.message || "Server error");
    }
  };

  const passwordRules = [
    { required: true, message: "Please enter a password" },
    { min: 6, message: "Password must be at least 6 characters" },
    {
      validator: (_, value) => {
        if (!value) return Promise.reject("Please enter a password");
        if (value.trim() === "" || /^["']+$/.test(value)) {
          return Promise.reject("Password cannot be only quotes or spaces");
        }
        if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
          return Promise.reject("Password must contain letters and numbers");
        }
        return Promise.resolve();
      },
    },
  ];

  return (
    <div style={{ maxWidth: 400, margin: "50px auto" }}>
      <h2>Register</h2>
      <Form form={form} layout="vertical" onFinish={onFinish}>
        <Form.Item
          label="Name"
          name="name"
          rules={[{ required: true, message: "Please enter your name" }]}
        >
          <Input placeholder="Name" />
        </Form.Item>

        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Please enter your email" },
            { type: "email", message: "Please enter a valid email" },
          ]}
        >
          <Input placeholder="Email" />
        </Form.Item>

        <Form.Item label="Password" name="password" rules={passwordRules} hasFeedback>
          <Input.Password placeholder="Password" />
        </Form.Item>

        <Form.Item
          label="Confirm Password"
          name="confirmPassword"
          dependencies={["password"]}
          hasFeedback
          rules={[
            { required: true, message: "Please confirm your password" },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue("password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject("Passwords do not match!");
              },
            }),
          ]}
        >
          <Input.Password placeholder="Confirm Password" />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            Register
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;


