import { useState } from 'react';

import { Button, Form, Tag, message, Upload } from 'antd';

import { UploadOutlined } from '@ant-design/icons';

export default function AppSettingForm() {
  const beforeUpload = (file) => {
    const isJpgOrPng =
      file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/svg+xml';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJpgOrPng && isLt2M;
  };
  return (
    <>
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
