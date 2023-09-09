import React from 'react';
import { useProfileContext } from '@/context/profileContext';
import { CloseCircleOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Col, Form, PageHeader, Row } from 'antd';
import { useDispatch } from 'react-redux';
import { erp } from '@/redux/erp/actions';
import ProfileForm from '@/forms/ProfileForm';
import UploadImg from './UploadImg';
import uniqueId from '@/utils/uinqueId';

const UpdateAdmin = ({ config }) => {
  const { profileContextAction } = useProfileContext();
  const { updatePanel } = profileContextAction;
  const dispatch = useDispatch();
  const { ENTITY_NAME } = config;
  const [form] = Form.useForm();

  const authInfo = window.localStorage.getItem('auth');
  const jsonObject = JSON.parse(authInfo || {});
  const { id } = jsonObject;
  const entity = 'admin';

  const formResetAndClose = () => {
    form.resetFields();
    updatePanel.close();
  };

  const onFinish = (values) => {
    dispatch(erp.update({ entity, id, jsonData: values }));
    formResetAndClose();
  };

  const handelClick = (e) => {
    formResetAndClose();
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
        ]}
        style={{
          padding: '20px 0px',
        }}
      ></PageHeader>
      <Row align="start">
        <Col xs={{ span: 24 }} sm={{ span: 6 }} md={{ span: 6 }}>
          <UploadImg />
        </Col>
        <Col xs={{ span: 18 }}>
          <Form
            form={form}
            onFinish={onFinish}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 12 }}
            layout="vertical"
          >
            <ProfileForm isUpdateForm={true} />
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
