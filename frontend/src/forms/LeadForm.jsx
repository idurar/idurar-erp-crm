import React, { useState, useEffect, useRef } from 'react';
import { Form, Input, InputNumber, Button, Select, Divider, Row, Col } from 'antd';

import { PlusOutlined } from '@ant-design/icons';

export default function LeadForm() {
  return (
    <>
      <Form.Item
        label="First Name"
        name="firstName"
        rules={[
          {
            required: true,
            message: 'Please input First name!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Last Name"
        name="lastName"
        rules={[
          {
            required: true,
            message: 'Please input Last name!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input Email!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Phone Number"
        name="phone"
        rules={[
          {
            required: true,
            message: 'Please input Phone Number!',
          },
        ]}
      >
        <Input type="tel" />
      </Form.Item>

      <Form.Item
        label="Company"
        name="company"
        rules={[
          {
            required: true,
            message: 'Please input Lead Company!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Job Title"
        name="jobTitle"
        rules={[
          {
            required: true,
            message: 'Please input the Job Title!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label="Address" name="address">
        <Input />
      </Form.Item>

      <Form.Item label="Country" name="country">
        <Input />
      </Form.Item>

      <Form.Item
        label="status"
        name="status"
        rules={[
          {
            required: false,
            message: 'Please input Lead status!',
          },
        ]}
        initialValue={'new'}
      >
        <Select
          options={[
            { value: 'new', label: 'New' },
            { value: 'reached', label: 'Reached' },
            { value: 'interested', label: 'Interest' },
            { value: 'not interested', label: 'Not Interest' },
          ]}
        ></Select>
      </Form.Item>

      <Form.Item label="Note" name="note">
        <Input />
      </Form.Item>

      <Form.Item label="Source" name="source">
        <Input placeholder="ex: linkedin, website, ads..." />
      </Form.Item>
    </>
  );
}
