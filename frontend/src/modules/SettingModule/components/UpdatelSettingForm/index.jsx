import React, { useEffect, useState } from 'react';
import compare from 'just-compare';

import { useDispatch, useSelector } from 'react-redux';
import { settingsAction } from '@/redux/settings/actions';
import { selectSettings } from '@/redux/settings/selectors';

import { Button, Form } from 'antd';
import Loading from '@/components/Loading';

export default function UpdatelSettingForm({ config, children }) {
  let { entity, settingsCategory } = config;
  const dispatch = useDispatch();
  const { result, isLoading, isSuccess } = useSelector(selectSettings);

  const [form] = Form.useForm();
  const [isNotChanged, setChanged] = useState(true);
  const onSubmit = (fieldsValue) => {
    const settings = [];

    for (const [key, value] of Object.entries(fieldsValue)) {
      settings.push({ settingKey: key, settingValue: value });
    }

    console.log('🚀 ~ file: index.jsx:20 ~ onSubmit ~ settings:', settings);
    dispatch(settingsAction.updateMany({ entity, jsonData: { settings } }));
  };
  const currentSettings = result[settingsCategory];

  const handleValuesChange = (fieldsValue, allValues) => {
    // console.log('🚀 ~ file: index.jsx:29 ~ UpdatelSettingForm ~ currentSettings:', currentSettings);
    // console.log('🚀 ~ file: index.jsx:31 ~ handleValuesChange ~ allValues:', allValues);
    // for (const [key, value] of Object.entries(allValues)) {
    //   const compResult = compare(allValues[key], currentSettings[key]);
    //   console.log(
    //     '🚀 ~ file: index.jsx:35 ~ handleValuesChange ~ currentSettings[key]:',
    //     currentSettings[key]
    //   );
    //   console.log('🚀 ~ file: index.jsx:35 ~ handleValuesChange ~ allValues[key]:', allValues[key]);
    //   if (!compResult) {
    //     console.log('🚀 ~ file: index.jsx:35 ~ handleValuesChange ~ compResult:', compResult);
    //     setChanged(true);
    //     break;
    //   } else setChanged(false);
    // }
    // console.log('🚀 ~ file: index.jsx:30 ~ handleValuesChange ~ isNotChanged:', isNotChanged);
  };
  useEffect(() => {
    const current = result[settingsCategory];

    form.setFieldsValue(current);
  }, [result]);

  useEffect(() => {
    if (isSuccess) {
      //form.resetFields();
      dispatch(settingsAction.list({ entity }));
    }
  }, [isSuccess]);

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
