import React, { useState } from "react";
import { Form, Input, Button, Radio, Select, Switch } from "antd";
import { DatePicker, TimePicker, Calendar } from "@/components/antd";
import dayjs from "dayjs";
import { createSync } from "@/axiosRequest";
export default function FormPatient() {
  const [form] = Form.useForm();
  const onFinish = (fieldsValue) => {
    // Should format date value before submit.
    const values = {
      ...fieldsValue,
      birthday: fieldsValue["birthday"].format("DD/MM/YYYY"),
    };

    const ajaxCall = createSync("patient", values);
    ajaxCall.then(function (response) {
      if (response === undefined || response.success === false) {
        return;
      }
      form.resetFields();
      console.log("Sent values of form: ", response);
    });
  };
  const tailLayout = {
    wrapperCol: { offset: 6, span: 14 },
  };
  const dateFormat = "DD/MM/YYYY";
  return (
    <>
      <Form
        form={form}
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 14,
        }}
        layout="horizontal"
        onFinish={onFinish}
      >
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
          <DatePicker format={dateFormat} />
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
        <Form.Item {...tailLayout}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
