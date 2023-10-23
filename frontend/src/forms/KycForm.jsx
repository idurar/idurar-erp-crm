import React from 'react';
import { Button, Form, Input, message, Upload, Select, InputNumber } from 'antd';

import { UploadOutlined } from '@ant-design/icons';

const beforeUpload = (file) => {
  console.log('🚀 ~ file: KycForm.jsx:15 ~ beforeUpload ~ file:', file);
  // Add any validation or checks before uploading the file
  return true;
};

export default function KycForm({ isUpdateForm = false }) {
  const validateEmptyString = (_, value) => {
    if (value && value.trim() === '') {
      return Promise.reject(new Error('Field cannot be empty'));
    }

    return Promise.resolve();
  };

  return (
    <>
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input the Name',
          },
          {
            validator: validateEmptyString,
            message: 'Please input valid value!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Contact"
        name="contact"
        rules={[
          {
            required: true,
            message: 'Please input the Contact!',
          },
          {
            validator: validateEmptyString,
            message: 'Please input valid value!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
        rules={[
          {
            required: true,
            message: 'Please input the Address!',
          },
          {
            validator: validateEmptyString,
            message: 'Please input valid value!',
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="file"
        label="File"
        valuePropName="fileList"
        getValueFromEvent={(e) => e.fileList}
      >
        <Upload beforeUpload={beforeUpload}>
          <Button icon={<UploadOutlined />}>Click to Upload</Button>
        </Upload>
      </Form.Item>
    </>
  );
}
