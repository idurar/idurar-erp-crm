import { useState } from 'react';
import { Form, Input, InputNumber, Select, Switch } from 'antd';

import { languages, tagColor } from '@/utils';

export default function MoneyFormSettingForm() {
  return (
    <>
      <Form.Item
        label="Currency Name"
        name="currency"
        rules={[
          {
            required: true,
            message: 'Please input your App Name!',
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        label="Currency Symbol"
        name="currency_symbol"
        rules={[
          {
            required: true,
            message: 'Please input your App Name!',
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        label="Currency Position"
        name="currency_position"
        rules={[
          {
            required: true,
            message: 'This Field is required',
          },
        ]}
      >
        <Select>
          <Select.Option value="before">before</Select.Option>
          <Select.Option value="after">after</Select.Option>
        </Select>
      </Form.Item>

      <Form.Item
        label="Decimal Separator"
        name="decimal_sep"
        rules={[
          {
            required: true,
            message: 'Please input your App Name!',
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        label="Thousand Separator"
        name="thousand_sep"
        rules={[
          {
            required: true,
            message: 'Please input your App Name!',
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>

      <Form.Item
        label="Cent precision "
        name="cent_precision"
        rules={[
          {
            required: true,
            message: 'Please input your App Name!',
          },
        ]}
      >
        <InputNumber min={0} />
      </Form.Item>

      <Form.Item
        label="Zero Format"
        name="zero_format"
        rules={[
          {
            required: true,
            message: 'Please input your App Name!',
          },
        ]}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item>
    </>
  );
}
