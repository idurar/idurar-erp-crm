import SelectAsync from '@/components/SelectAsync';
import { Form, Input } from 'antd';

export default function AdminForm({ isUpdateForm = false }) {
  return (
    <>
      <Form.Item
        label="Company name"
        name="company"
        rules={[
          {
            required: true,
            message: 'Please input your company name!',
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        label="Name"
        name="name"
        rules={[
          {
            required: true,
            message: 'Please input your name!',
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
        label="Company registration nr"
        name="companyRegNumber"
        rules={[
          {
            required: true,
            message: 'Please input your company registration number!',
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>

      {!isUpdateForm && (
        <>
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
        </>
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
