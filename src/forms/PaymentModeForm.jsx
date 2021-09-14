import React from "react";
import { Switch, Form, Input } from "antd";
import { CloseOutlined, CheckOutlined } from "@ant-design/icons";

export default function PaymentModeForm({ isUpdateForm = false }) {
  return (
    <>
      <Form.Item
        label="Payment Mode Name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input your currency name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <Input />
      </Form.Item>

      <Form.Item
        label="Mode enabled"
        name="enabled"
        rules={[
          {
            required: true,
          },
        ]}
        style={{
          display: "inline-block",
          width: "calc(50%)",
          paddingRight: "5px",
        }}
        valuePropName="checked"
      >
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
      </Form.Item>
      <Form.Item
        label="Is Default Mode"
        name="isDefault"
        rules={[
          {
            required: true,
          },
        ]}
        style={{
          display: "inline-block",
          width: "calc(50%)",
          paddingLeft: "5px",
        }}
        valuePropName="checked"
      >
        <Switch
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
      </Form.Item>
    </>
  );
}
