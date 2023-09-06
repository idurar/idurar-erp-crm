import { useProfileContext } from '@/context/profileContext';
import uniqueId from '@/utils/uinqueId';
import { CloseCircleOutlined, EditOutlined, LockOutlined, SaveOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Divider, Form, PageHeader, Row } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import AdminForm from '@/forms/AdminForm';
import UploadImg from './UploadImg';
import { erp } from '@/redux/erp/actions';

const UpdateAdmin = ({ config }) => {
  const { profileContextAction } = useProfileContext();
  const { readPanel, updatePanel } = profileContextAction;
  const dispatch = useDispatch();
  const { ENTITY_NAME } = config;
  const [form] = Form.useForm();

  const authInfo = window.localStorage.getItem('auth');
  const jsonObject = JSON.parse(authInfo || {});
  const { id } = jsonObject;
  const entity = 'admin';

  const onFinish = (values) => {
    console.log(values);
    dispatch(erp.update({ entity, id, jsonData: values }));
  };

  const handelClick = (e) => {
    updatePanel.close();
  };

  return (
    <>
      <PageHeader
        onBack={() => updatePanel.close()}
        title={ENTITY_NAME}
        ghost={false}
        extra={[
          <Button
            onClick={() => handelClick()}
            key={`${uniqueId()}`}
            icon={<CloseCircleOutlined />}
          >
            Close
          </Button>,
          // <Button
          //   key={`${uniqueId()}`}
          //   onClick={() => handelClick}
          //   type="primary"
          //   icon={<SaveOutlined />}
          // >
          //   save
          // </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Row align="start">
        <Col xs={{ span: 24 }} sm={{ span: 6 }} md={{ span: 6 }}>
          <UploadImg />
        </Col>
        <Col xs={{ span: 16 }}>
          <Form
            form={form}
            onFinish={onFinish}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            layout="vertical"
          >
            <AdminForm isUpdateForm={true} />
            <Form.Item>
              <Button icon={<SaveOutlined />} type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default UpdateAdmin;
