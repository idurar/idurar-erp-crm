import React from "react";
import { Form, Input, Select } from "antd";
import SelectAsync from "@/components/SelectAsync";
import AutoCompleteAsync from "@/components/AutoCompleteAsync";

export default function AdminForm({ isUpdateForm = false }) {
  return (
    <>
      <Form.Item
        label="Employee"
        name="employee"
        rules={[
          {
            required: true,
            message: "This Field is required",
          },
        ]}
      >
        <AutoCompleteAsync
          entity={"employee"}
          keyRef={"employee"}
          displayLabels={["name", "surname"]}
          searchFields={"name,surame"}
        />
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
        <SelectAsync
          entity={"role"}
          displayLabels={["displayName"]}
        ></SelectAsync>
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
        <Input autoComplete="off" />
      </Form.Item>
      {!isUpdateForm && (
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
          <Input type="password" autoComplete="off" />
        </Form.Item>
      )}
    </>
  );
}
