import { useEffect, useState } from 'react';
import compare from 'just-compare';

import { useDispatch, useSelector } from 'react-redux';
import { settingsAction } from '@/redux/settings/actions';
import { selectSettings } from '@/redux/settings/selectors';

import { Button, Form } from 'antd';
import Loading from '@/components/Loading';

export default function UploadSettingForm({ config, settingKey, children }) {
  let { entity, settingsCategory } = config;
  const dispatch = useDispatch();
  const { result, isLoading, isSuccess } = useSelector(selectSettings);

  const [form] = Form.useForm();

  const onSubmit = (fieldsValue) => {
    if (fieldsValue.file) {
      fieldsValue.file = fieldsValue.file[0].originFileObj;
    }

    dispatch(settingsAction.upload({ entity, settingKey, jsonData: fieldsValue }));
  };

  const handleValuesChange = (fieldsValue, allValues) => {};
  useEffect(() => {
    const current = result[settingsCategory];

    form.setFieldsValue(current);
  }, [result]);

  return (
    <div>
      <Loading isLoading={isLoading}>
        <Form
          form={form}
          onFinish={onSubmit}
          onValuesChange={handleValuesChange}
          labelCol={{ span: 8 }}
          labelAlign="left"
          wrapperCol={{ span: 16 }}
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
