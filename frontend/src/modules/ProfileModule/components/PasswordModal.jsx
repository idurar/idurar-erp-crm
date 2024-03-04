import { useProfileContext } from '@/context/profileContext';
import useOnFetch from '@/hooks/useOnFetch';
import { request } from '@/request';
import { Form, Input, Modal, Progress } from 'antd';
import { useState } from 'react';
import useLanguage from '@/locale/useLanguage';

const PasswordModal = () => {
  const translate = useLanguage();

  const { state, profileContextAction } = useProfileContext();
  const { modal } = profileContextAction;
  const { passwordModal } = state;
  const modalTitle = translate('Update Password');

  const [passForm] = Form.useForm();
  const [passwordStrength, setPasswordStrength] = useState(0);
  const { onFetch } = useOnFetch();

  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;

    // Calculate the password strength based on the specified criteria
    const strength = calculatePasswordStrength(newPassword);

    // Update the password strength state
    setPasswordStrength(strength);
  };

  const calculatePasswordStrength = (password) => {
    // Password strength criteria
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-]/.test(password);
    const isLengthValid = password.length >= 8;

    // Calculate the password strength score based on the criteria
    const strength =
      (hasUpperCase + hasLowerCase + hasNumber + hasSpecialChar + isLengthValid) * 20;

    return Math.min(100, strength); // Ensure the strength does not exceed 100
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

  const getProgressBarColor = () => {
    if (passwordStrength >= 80) {
      return '#95DE64'; // Green
    } else if (passwordStrength >= 60) {
      return '#FFA940'; // Orange
    } else if (passwordStrength >= 40) {
      return '#FFD700'; // Yellow 
    } else {
      return '#FF4D4F'; // Red
    }
  };

  return (
    <Modal
      title={modalTitle}
      visible={passwordModal.isOpen} // Changed prop name from 'open' to 'visible'
      onCancel={modal.close}
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
              message: 'Please enter a valid password.',
            },
          ]}
          hasFeedback
        >
          <Input.Password onChange={handlePasswordChange} />
        </Form.Item>
        <Progress
          type="line"
          percent={passwordStrength}
          format={() => `${passwordStrength}%`}
          strokeColor={getProgressBarColor()} // Changed prop name from 'stroke' to 'strokeColor'
          style={{
            marginBottom: '10px',
          }}
        />
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
          <Input.Password autoComplete="new-password" />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default PasswordModal;