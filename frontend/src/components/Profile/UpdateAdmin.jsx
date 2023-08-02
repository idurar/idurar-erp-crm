import { useProfileContext } from '@/context/profileContext';
import uniqueId from '@/utils/uinqueId';
import { CloseCircleOutlined, EditOutlined, LockOutlined, SaveOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Divider, Form, PageHeader, Row } from 'antd';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import AdminForm from '@/forms/AdminForm';
import UploadImg from './UploadImg';

const UpdateAdmin = ({ config }) => {
  const { profileContextAction } = useProfileContext();
  const { readPanel, updatePanel } = profileContextAction;
  const dispatch = useDispatch();
  const { ENTITY_NAME } = config;

  return (
    <>
      <PageHeader
        onBack={() => updatePanel.close()}
        title={ENTITY_NAME}
        ghost={false}
        //   tags={<Tag color="volcano">{currentErp.paymentStatus || currentErp.status}</Tag>}
        // subTitle="This is cuurent erp page"
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
            onClick={() => updatePanel.close()}
            type="primary"
            icon={<SaveOutlined />}
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
          <Form labelCol={{ span: 4 }} wrapperCol={{ span: 12 }}>
            <AdminForm isUpdateForm={true} />
          </Form>
        </Col>
      </Row>
    </>
  );
};

export default UpdateAdmin;
