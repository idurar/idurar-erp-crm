import React, { useState } from 'react';
import { Button, Form, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

export default function AppSettingForm() {
  const translate = useLanguage();
  const [fileList, setFileList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const beforeUpload = (file) => {
    const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
    if (!isJpgOrPng) {
      message.error('You can only upload JPG/PNG file!');
      return Upload.LIST_IGNORE;
    }
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isLt5M) {
      message.error('Image must smaller than 5MB!');
      return Upload.LIST_IGNORE;
    }
    return false; // stop auto upload, we'll handle manually
  };

  const handleUpload = async () => {
    if (fileList.length === 0) {
      message.error('Please select a file first!');
      return;
    }

    const file = fileList[0];
    const formData = new FormData();
    formData.append('file', file);
    
    // If you need to specify which setting this is for
    formData.append('settingKey', 'app_logo'); // or whatever setting key you're using

    setUploading(true);

    try {
      // Option 1: Using your updateBySettingKey endpoint
      const response = await fetch('/api/setting/app_logo', {
        method: 'PUT',
        body: formData,
        // headers will be set automatically for FormData
      });

      // Option 2: If you prefer using updateManySetting
      // const response = await fetch('/api/setting/updateMany', {
      //   method: 'PUT',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     settings: [{
      //       settingKey: 'app_logo',
      //       settingValue: file.name // or the file path/URL after upload
      //     }]
      //   }),
      // });

      const result = await response.json();

      if (result.success) {
        message.success('Logo uploaded successfully!');
        // If your backend returns the file path/URL, you might want to store it
        console.log('Upload result:', result);
      } else {
        message.error(result.message || 'Upload failed!');
      }
    } catch (error) {
      console.error('Upload error:', error);
      message.error('Upload failed!');
    } finally {
      setUploading(false);
    }
  };

  const handleChange = ({ fileList }) => {
    setFileList(fileList);
    
    // Auto-upload when file is selected (optional)
    if (fileList.length > 0 && fileList[0].status === 'done') {
      // File was just added, trigger upload
      handleUpload();
    }
  };

  const uploadProps = {
    beforeUpload,
    listType: "picture",
    fileList,
    onChange: handleChange,
    onRemove: () => setFileList([]),
  };

  return (
    <Form.Item
      name="logo"
      label="Logo"
      valuePropName="fileList"
      getValueFromEvent={(e) => {
        if (Array.isArray(e)) {
          return e;
        }
        return e?.fileList;
      }}
    >
      <Upload {...uploadProps}>
        <Button icon={<UploadOutlined />}>{translate('click_to_upload')}</Button>
      </Upload>
      {/* Optional: Manual upload button */}
      {/* <Button
        type="primary"
        onClick={handleUpload}
        disabled={fileList.length === 0}
        loading={uploading}
        style={{ marginTop: 16 }}
      >
        {uploading ? 'Uploading' : 'Start Upload'}
      </Button> */}
    </Form.Item>
  );
}