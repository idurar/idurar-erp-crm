import { useProfileContext } from '@/context/profileContext';
import useOnFetch from '@/hooks/useOnFetch';
import { request } from '@/request';
import { Button, Form, Input, Modal } from 'antd';
import React, { useEffect } from 'react';

const PasswordModal = ({ config }) => {
  const { state, profileContextAction } = useProfileContext();
  const { modal, updatePanel } = profileContextAction;
  const { update, read, passwordModal } = state;
  const modalTitle = 'Update password';

  const [passForm] = Form.useForm();

  const { onFetch, result, isLoading, isSuccess } = useOnFetch();

  useEffect(() => {
    if (isSuccess) {
      passForm.resetFields();
    }
  }, [isSuccess]);

  const handelSubmit = (fieldsValue) => {
    const entity = 'admin/password-update/' + config.id;
    const updateFn = () => {
      return request.patch({ entity, jsonData: fieldsValue });
    };
    onFetch(updateFn);
  };
  return (
    <Modal
      title={modalTitle}
      visible={passwordModal.isOpen}
      onCancel={modal.close}
      okText="Update"
      onOk={() => {
        passForm.submit();
        modal.close();
      }}
    >
      <Form form={passForm} layout="vertical" onFinish={handelSubmit}>
        <Form.Item
          label="New Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
              min: 8,
            },
          ]}
          hasFeedback
        >
          <Input.Password />
        </Form.Item>
        <Form.Item
          label="Confirm Password"
          name="repassword"
          hasFeedback
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  new Error('The two passwords that you entered do not match!')
                );
              },
            }),
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PasswordModal;
