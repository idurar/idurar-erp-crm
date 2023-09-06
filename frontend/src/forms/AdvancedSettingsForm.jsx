import React from 'react';
import { Switch, Form, Input } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

export default function AdvancedSettingsForm({ isUpdateForm = false }) {
  return (
    <>
      <Form.Item
        label="Setting Name"
        name="settingKey"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Value"
        name="settingValue"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label="Setting enabled"
        name="enabled"
        style={{
          display: 'inline-block',
          width: 'calc(50%)',
          paddingRight: '5px',
        }}
        valuePropName="checked"
        initialValue={true}
      >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>
      <Form.Item
        label="Is Core Setting"
        name="isCoreSetting"
        style={{
          display: 'inline-block',
          width: 'calc(50%)',
          paddingLeft: '5px',
        }}
        valuePropName="checked"
      >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>
    </>
  );
}
