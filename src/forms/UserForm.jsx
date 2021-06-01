import React from "react";
import { Form, Input, Select } from "antd";
import SelectAsync from "@/components/SelectAsync";
import SearchField from "@/components/SearchField";

export default function UserForm({ autoCompleteUpdate = null }) {
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
          {/* <Select.Option value="amin">Admin</Select.Option> */}
        </Select>
      </Form.Item>
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
        <SearchField
          entity={"employee"}
          keyRef={"employee"}
          displayLabels={["name", "surname"]}
          searchFields={"name,surame"}
          onUpdateValue={autoCompleteUpdate}
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
    </>
  );
}
