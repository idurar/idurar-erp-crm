import React from "react";
import { Form, Input, Button, Radio, Select, Switch } from "antd";
import { DatePicker, TimePicker, Calendar } from "@/components/CustomAntd";

export default function PatientForm() {
  return (
    <>
      <Form.Item
        label="name"
        name="name"
        rules={[
          {
            required: true,
            message: "Please input your name!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Surname"
        name="surname"
        rules={[
          {
            required: true,
            message: "Please input your surname!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Birthday"
        name="birthday"
        rules={[
          {
            required: true,
            message: "Please input your birthday!",
          },
        ]}
      >
        <DatePicker format={"DD/MM/YYYY"} />
      </Form.Item>
      <Form.Item
        label="Gender"
        name="sexe"
        rules={[
          {
            required: true,
            message: "Please input your Gender!",
          },
        ]}
      >
        <Select>
          <Select.Option value="men">Men</Select.Option>
          <Select.Option value="women">Women</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        name="email"
        label="E-mail"
        rules={[
          {
            type: "email",
            message: "The input is not valid E-mail!",
          },
          {
            required: true,
            message: "Please input your E-mail!",
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="tel"
        label="Phone Number"
        rules={[
          {
            required: true,
            message: "Please input your phone!",
          },
        ]}
      >
        <Input />
      </Form.Item>
    </>
  );
}
