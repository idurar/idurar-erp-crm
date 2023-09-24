import React, { useEffect } from 'react';
import dayjs from 'dayjs';

import { useDispatch, useSelector } from 'react-redux';
import { settings } from '@/redux/settings/actions';
import { selectSettings } from '@/redux/settings/selectors';

import { Button, Form } from 'antd';
import Loading from '@/components/Loading';

export default function UpdatelSettingForm({ config, children }) {
  let { entity, settingsCategory } = config;
  const dispatch = useDispatch();
  const { result, isLoading, isSuccess } = useSelector(selectSettings);

  const [form] = Form.useForm();

  const onSubmit = (fieldsValue) => {
    const settings = [];

    for (const [key, value] of Object.entries(fieldsValue)) {
      settings.push({ settingKey: key, settingValue: value });
    }

    console.log('🚀 ~ file: index.jsx:20 ~ onSubmit ~ settings:', settings);
    dispatch(settings.updateMany({ entity, jsonData: fieldsValue }));
  };

  useEffect(() => {
    console.log('🚀 ~ file: index.jsx:15 ~ UpdateForm ~ result:', result);
    const current = result[settingsCategory];

    console.log('🚀 ~ file: index.jsx ~ line 40 ~ useEffect ~ obj', current);
    form.setFieldsValue(current);
  }, [result]);

  useEffect(() => {
    if (isSuccess) {
      //form.resetFields();
      dispatch(settings.list({ entity }));
    }
  }, [isSuccess]);

  return (
    <div>
      <Loading isLoading={isLoading}>
        <Form
          form={form}
          onFinish={onSubmit}
          labelCol={{ span: 6 }}
          labelAlign="left"
          wrapperCol={{ span: 18 }}
        >
          {children}
          <Form.Item
            style={{
              display: 'inline-block',
              paddingRight: '5px',
            }}
          >
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
          <Form.Item
            style={{
              display: 'inline-block',
              paddingLeft: '5px',
            }}
          >
            <Button onClick={() => console.log('Cancel clicked')}>Cancel</Button>
          </Form.Item>
        </Form>
      </Loading>
    </div>
  );
}
