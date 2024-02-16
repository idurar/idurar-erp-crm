import { useProfileContext } from '@/context/profileContext';
import useOnFetch from '@/hooks/useOnFetch';
import { request } from '@/request';
import { Form, Input, Modal } from 'antd';
import { useEffect } from 'react';
import useLanguage from '@/locale/useLanguage';

const PasswordModal = () => {
  const translate = useLanguage();

  const { state, profileContextAction } = useProfileContext();
  const { modal } = profileContextAction;
  const { passwordModal } = state;
  const modalTitle = translate('Update Password');

  const [passForm] = Form.useForm();

  const { onFetch } = useOnFetch();
  const resetForm = () => {
    passForm.resetFields(); // Reset form fields
    passForm.setFields([{ name: 'password', errors: [] }]); // Clear password error message
    passForm.setFields([{ name: 'passwordCheck', errors: [] }]); // Clear passwordCheck error message
  };
  const handelSubmit = (fieldsValue) => {
    const entity = 'admin/profile/password/';
    const updateFn = async () => {
      return await request.patch({ entity, jsonData: fieldsValue });
    };
    const callback = updateFn();
    onFetch(callback);
    passForm.resetFields();
    modal.close();
  };
  useEffect(() => {
    // Reset form when modal is closed
    if (!passwordModal.isOpen) {
      resetForm();
    }
  }, [passwordModal.isOpen]);
  return (
    <Modal
    title={<div style={{ textAlign: 'center' }}>{modalTitle}</div>}
      open={passwordModal.isOpen}
      closable={false} // Set closable prop to false to remove the close icon
      visible={passwordModal.isOpen} // Use "visible" instead of "open" prop
      onCancel={() => {
        modal.close();
        resetForm(); // Reset form when modal is canceled
      }}
      okText="Update"
      onOk={() => {
        passForm.submit();
      }}
    >
      <Form form={passForm} layout="vertical" onFinish={handelSubmit}>
        <Form.Item
          label={translate('New Password')}
          name="password"
          rules={[
            {
              required: true,
              min: 8,
            },
          ]}
          hasFeedback
        >
          <Input.Password placeholder="New Password"/>
        </Form.Item>
        <Form.Item
          label={translate('Confirm Password')}
          name="passwordCheck"
          hasFeedback
          rules={[
            {
              required: true,
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
          <Input.Password autoComplete="new-password" placeholder="Confirm Password"/>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PasswordModal;
