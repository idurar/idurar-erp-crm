import { useProfileContext } from '@/context/profileContext';
import uniqueId from '@/utils/uinqueId';
import { EditOutlined, LockOutlined, LogoutOutlined, MailOutlined } from '@ant-design/icons';
import { Avatar, Button, Col, Descriptions, Divider, PageHeader, Row, Space, Tag } from 'antd';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import photo from '@/style/images/photo.png';
import history from '@/utils/history';
import { selectCurrentAdmin } from '@/redux/auth/selectors';

const AdminInfo = ({ config }) => {
  const { profileContextAction } = useProfileContext();
  const { modal, updatePanel } = profileContextAction;
  const dispatch = useDispatch();
  const { ENTITY_NAME } = config;

  const state = useSelector((state) => state);

  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title={ENTITY_NAME}
        ghost={false}
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              updatePanel.open();
            }}
            type="primary"
            icon={<EditOutlined />}
          >
            Edit
          </Button>,
          <Button
            key={`${uniqueId()}`}
            icon={<LockOutlined />}
            onClick={() => {
              modal.open();
            }}
          >
            Update Password
          </Button>,
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Row align="middle">
        <Col xs={{ span: 24 }} sm={{ span: 7 }} md={{ span: 5 }}>
          <img
            className="last left circle pad5"
            src={photo}
            style={{
              width: '100px',
              height: '100px',
              border: '2px solid #1B98F5',
            }}
          />
        </Col>
        <Col xs={{ span: 24 }} sm={{ span: 18 }}>
          <Descriptions labelStyle={{ fontSize: '17px' }} size="small">
            <Descriptions.Item label="Name" span="3" style={{ paddingTop: '20px' }}>
              <h3
                style={{
                  color: '#22075e',
                }}
              >
                Salah Eddine
              </h3>
            </Descriptions.Item>
            <Descriptions.Item label="Surname" span="3">
              <h3
                style={{
                  color: '#22075e',
                }}
              >
                Lalami
              </h3>
            </Descriptions.Item>
            <Descriptions.Item label="Email" span="3" style={{ paddingTop: '20px' }}>
              <h3
                style={{
                  color: '#22075e',
                }}
              >
                admin@demo.com
              </h3>
            </Descriptions.Item>
            <Descriptions.Item label="Role d'utilisateur" span="3">
              <h3
                style={{
                  color: '#22075e',
                }}
              >
                admin
              </h3>
            </Descriptions.Item>
          </Descriptions>
        </Col>
      </Row>

      <Divider />
      <Button
        key={`${uniqueId()}`}
        icon={<LogoutOutlined />}
        className="right"
        onClick={() => history.push('/logout')}
      >
        Logout
      </Button>
    </>
  );
};

export default AdminInfo;
