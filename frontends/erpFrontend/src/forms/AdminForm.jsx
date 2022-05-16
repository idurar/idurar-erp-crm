import SelectAsync from '@/components/SelectAsync';
import { Form, Input } from 'antd';

export default function AdminForm({ isUpdateForm = false }) {
  return (
    <>
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input your Name!',
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        label="Surname"
        name="surname"
        rules={[
          {
            required: true,
            message: 'Please input your surname!',
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        label="E-mail"
        name="email"
        rules={[
          {
            required: true,
            message: 'Please input your Email!',
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>

      {!isUpdateForm && (
        <Form.Item
          label="Password"
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input.Password autoComplete="new-password" />
        </Form.Item>
      )}
      <Form.Item
        label="Role"
        name="role"
        rules={[
          {
            required: true,
            message: 'This Field is required',
          },
        ]}
      >
        <SelectAsync entity={'role'} displayLabels={['displayName']}></SelectAsync>
      </Form.Item>
    </>
  );
}
