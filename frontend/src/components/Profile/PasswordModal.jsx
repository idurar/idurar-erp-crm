import { useProfileContext } from '@/context/profileContext';
import { Button, Form, Input, Modal } from 'antd';
import React from 'react';

const PasswordModal = () => {
  const { state, profileContextAction } = useProfileContext();
  const { modal, updatePanel } = profileContextAction;
  const { update, read, passwordModal } = state;
  const modalTitle = 'Update password';

  const handelSubmit = (fieldsValue) => {
    console.log('Received values of form: ', fieldsValue);
  };
  return (
    <Modal
      title={modalTitle}
      visible={passwordModal.isOpen}
      //   onOk={handleOk}
      onCancel={modal.close}
      //   confirmLoading={isLoading}
      okText="Update"
    >
      <Form layout="vertical" onFinish={handelSubmit}>
        <Form.Item
          label="New Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
              len: 8,
            },
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
        <Form.Item
          label="Repeat Password"
          name="repassword"
          rules={[
            {
              required: true,
              message: 'Password does not match!',
              len: 8,
            },
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PasswordModal;
