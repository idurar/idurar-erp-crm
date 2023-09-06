import { useProfileContext } from '@/context/profileContext';
import uniqueId from '@/utils/uinqueId';
import { CloseCircleOutlined, EditOutlined, LockOutlined, SaveOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Divider, Form, PageHeader, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import AdminForm from '@/forms/AdminForm';
import UploadImg from './UploadImg';
import { selectCurrentAdmin } from '@/redux/auth/selectors';
import { crud } from '@/redux/crud/actions';

const UpdateAdmin = ({ config }) => {
  const { profileContextAction } = useProfileContext();
  const { readPanel, updatePanel } = profileContextAction;
  const dispatch = useDispatch();
  const { ENTITY_NAME } = config;

  const current = useSelector(selectCurrentAdmin);
  console.log('🚀 ~ file: UpdateProfile.jsx:18 ~ UpdateProfile ~ current:', current);
  const [form] = Form.useForm();
  console.log('🚀 ~ file: UpdateProfile.jsx:21 ~ UpdateProfile ~ form:', form);

  useEffect(() => {
    form.setFieldsValue(current);
  }, [current.id]);

  const handleSubmit = () => {
    form.submit();
  };

  const onSubmit = (fieldsValue) => {
    const id = current.id;
    const entity = 'admin';
    console.log('🚀 ~ file: index.jsx ~ line 34 ~ onSubmit ~  current._id', current.id);
    dispatch(crud.update({ entity, id, jsonData: fieldsValue }));
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
        <Col xs={{ span: 24 }} sm={{ span: 6 }} md={{ span: 4 }}>
          <UploadImg />
        </Col>
        <Col xs={{ span: 16 }}>
          <Form form={form} onFinish={onSubmit} labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
            <AdminForm isUpdateForm={true} />
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default UpdateAdmin;
