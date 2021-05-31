import React from "react";
import { Form, Input, Select } from "antd";

export default function UserForm() {
  return (
    <>
      <Form.Item
        label="Account Type"
        name="accountType"
        rules={[
          {
            required: true,
            message: "This Field is required",
          },
        ]}
      >
        <Select>
          <Select.Option value="employee">Employee</Select.Option>
          <Select.Option value="amin">Admin</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Role"
        name="role"
        rules={[
          {
            required: true,
            message: "This Field is required",
          },
        ]}
      >
        <Select>
          <Select.Option value="Admin">Admin</Select.Option>
          <Select.Option value="Editor">Editor</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="E-mail"
        name="email"
        rules={[
          {
            required: true,
            message: "Please input your Email!",
          },
        ]}
      >
        <Input autocomplete="off" />
      </Form.Item>
      <Form.Item
        label="Password"
        name="password"
        rules={[
          {
            required: true,
            message: "Please input your Password!",
          },
        ]}
      >
        <Input type="password" autocomplete="off" />
      </Form.Item>
    </>
  );
}
