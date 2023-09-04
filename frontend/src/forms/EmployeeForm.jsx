import React from 'react';
import { Form, Input, Button, Radio, Select, Switch } from 'antd';
import { DatePicker, TimePicker, Calendar } from '@/components/CustomAntd';
import { validatePhoneNumber } from '@/utils/helpers';

export default function EmployeeForm() {
  return (
    <>
      <Form.Item
        name="name"
        label="Name"
        rules={[
          {
            required: true,
            message: 'Please input your name!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="surname"
        label="Surname"
        rules={[
          {
            required: true,
            message: 'Please input your surname!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="birthday"
        label="Birthday"
        rules={[
          {
            required: true,
            message: 'Please input your birthday!',
          },
        ]}
      >
        <DatePicker format={'DD/MM/YYYY'} />
      </Form.Item>
      <Form.Item
        name="birthplace"
        label="Birthplace"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="gender"
        label="Gender"
        rules={[
          {
            required: true,
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
            type: 'email',
            message: 'The input is not valid E-mail!',
          },
          {
            required: true,
            message: 'Please input your E-mail!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label="Phone Number"
        rules={[
          {
            required: true,
            message: 'Please input your phone!',
          },
          {
            pattern: validatePhoneNumber, // importing regex from helper.js utility file to validate
            message: 'Please enter valid phone number!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="department"
        label="Department"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="position"
        label="Position"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="address"
        label="Address"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="state"
        label="State"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
    </>
  );
}
