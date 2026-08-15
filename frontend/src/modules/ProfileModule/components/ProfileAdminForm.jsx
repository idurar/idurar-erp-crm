import { Form, Input, Select } from 'antd';
import { UploadOutlined, CloseOutlined, CheckOutlined } from '@ant-design/icons';
import { message, Upload, Button, Switch } from 'antd';

import useLanguage from '@/locale/useLanguage';

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
  if (!isJpgOrPng) {
    message.error('You can only upload JPG/PNG file!');
  }
  const isLt2M = file.size / 1024 / 1024 < 5;
  if (!isLt2M) {
    message.error('Image must smaller than 5MB!');
  }
  return false;
};

export default function AdminForm({ isUpdateForm = false }) {
  function validateFormInputs(_, value, name){
    value = value.trim();
    if(!value || value == ''){
      return Promise.reject(new Error('Please enter your ' + name));
    }
    return Promise.resolve();
  }
  const translate = useLanguage();
  return (
    <>
      <Form.Item
        label={translate('first Name')}
        name="name"
        rules={[
          {
            validator: (_, value) => validateFormInputs(_, value, 'first Name')
          }
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        label={translate('last Name')}
        name="surname"
        rules={[
          {
            validator: (_, value) => validateFormInputs(_, value, 'last Name')
          }
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        label={translate('email')}
        name="email"
        rules={[
          {
            required: true,
          },
          {
            type: 'email',
          }
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>

      <Form.Item
        name="file"
        label={translate('Photo')}
        valuePropName="fileList"
        getValueFromEvent={(e) => e.fileList}
      >
        <Upload
          beforeUpload={beforeUpload}
          listType="picture"
          accept="image/png, image/jpeg"
          maxCount={1}
        >
          <Button icon={<UploadOutlined />}>{translate('click_to_upload')}</Button>
        </Upload>
      </Form.Item>
    </>
  );
}
