import React from 'react';
import { Form, Input, Select } from 'antd';
import { DatePicker } from '@/components/CustomAntd';
import { validatePhoneNumber } from '@/utils/helpers';

import useLanguage from '@/lang/useLanguage';

export default function EmployeeForm() {
  const getLang = useLanguage();

  return (
    <>
      <Form.Item
        name="name"
        label={getLang('first name')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="surname"
        label={getLang('last name')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="birthday"
        label={getLang('birthday')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <DatePicker format={'DD/MM/YYYY'} />
      </Form.Item>
      <Form.Item
        name="birthplace"
        label={getLang('birthplace')}
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
        label={getLang('gender')}
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
        label={getLang('email')}
        rules={[
          {
            type: 'email',
          },
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        label={getLang('phone')}
        rules={[
          {
            required: true,
          },
          {
            pattern: validatePhoneNumber, // importing regex from helper.js utility file to validate
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="department"
        label={getLang('Department')}
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
        label={getLang('Position')}
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
        label={getLang('Address')}
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
        label={getLang('State')}
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
