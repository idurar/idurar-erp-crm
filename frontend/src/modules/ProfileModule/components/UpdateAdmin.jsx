import { useProfileContext } from '@/context/profileContext';
import uniqueId from '@/utils/uinqueId';
import { CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Form, PageHeader, Row } from 'antd';
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminForm from '@/forms/AdminForm';
import UploadImg from './UploadImg';
import { updateProfile } from '@/redux/auth/actions';

import { selectCurrentAdmin } from '@/redux/auth/selectors';

import { selectCurrentLang } from '@/redux/lang/selectors';

const UpdateAdmin = ({ config }) => {
  const { profileContextAction } = useProfileContext();
  const { updatePanel } = profileContextAction;
  const dispatch = useDispatch();
  const { ENTITY_NAME } = config;

  const currentAdmin = useSelector(selectCurrentAdmin);
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(currentAdmin);
  }, [currentAdmin]);

  const handleSubmit = () => {
    form.submit();
  };

  const onSubmit = (fieldsValue) => {
    const { _id: id } = currentAdmin;

    if (fieldsValue.file) {
      fieldsValue.file = fieldsValue.file[0].originFileObj;
    }
    const trimmedValues = Object.keys(fieldsValue).reduce((acc, key) => {
      acc[key] = typeof fieldsValue[key] === 'string' ? fieldsValue[key].trim() : fieldsValue[key];
      return acc;
    }, {});
    dispatch(updateProfile({ entity: 'profile', id, jsonData: trimmedValues }));
  };

  return (
    <>
      <PageHeader
        onBack={() => updatePanel.close()}
        title={ENTITY_NAME}
        ghost={false}
        extra={[
          <Button
            onClick={() => updatePanel.close()}
            key={`${uniqueId()}`}
            icon={<CloseCircleOutlined />}
          >
            Close
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              handleSubmit();
              updatePanel.close();
            }}
            type="primary"
            icon={<SaveOutlined />}
            htmlType="submit"
          >
            save
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Row align="start">
        <Col xs={{ span: 24 }} sm={{ span: 6 }} md={{ span: 4 }}></Col>
        <Col xs={{ span: 16 }}>
          <Form
            form={form}
            onFinish={onSubmit}
            labelAlign="left"
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 12 }}
          >
            <AdminForm isUpdateForm={true} />
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default UpdateAdmin;
