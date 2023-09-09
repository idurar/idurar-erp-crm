import SelectAsync from '@/components/SelectAsync';
import { Form, Input } from 'antd';

export default function ProfileForm({ isUpdateForm = false }) {
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
        label="Manager name"
        style={{
          marginBottom: 0,
        }}
      >
        <Form.Item
          name="name"
          rules={[
            {
              required: true,
              message: 'Please input your name!',
            },
          ]}
          style={{
            display: 'inline-block',
            width: 'calc(50% - 8px)',
          }}
        >
          <Input placeholder="Name" />
        </Form.Item>
        <Form.Item
          name="surname"
          rules={[
            {
              required: true,
              message: 'Please input your surname!',
            },
          ]}
          style={{
            display: 'inline-block',
            width: 'calc(50% - 8px)',
            margin: '0 8px',
          }}
        >
          <Input placeholder="Sur name" />
        </Form.Item>
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
      <Form.Item
        label="Bank account"
        name="bankAccount"
        rules={[
          {
            required: true,
            message: 'Please input your bank account!',
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        label="Adress"
        style={{
          marginBottom: 0,
        }}
      >
        <Form.Item
          name="address"
          rules={[
            {
              required: true,
              message: 'Please input your address!',
            },
          ]}
          style={{
            display: 'inline-block',
            width: 'calc(50% - 8px)',
          }}
        >
          <Input placeholder="Address" />
        </Form.Item>
        <Form.Item
          name="city"
          rules={[
            {
              required: true,
              message: 'Please input your city!',
            },
          ]}
          style={{
            display: 'inline-block',
            width: 'calc(50% - 8px)',
            margin: '0 8px',
          }}
        >
          <Input placeholder="City" />
        </Form.Item>
        <Form.Item
          name="zipcode"
          rules={[
            {
              required: true,
              message: 'Please input your zip code!',
            },
          ]}
          style={{
            display: 'inline-block',
            width: 'calc(50% - 8px)',
          }}
        >
          <Input placeholder="Zip" />
        </Form.Item>
        <Form.Item
          name="country"
          rules={[
            {
              required: true,
              message: 'Please input your country!',
            },
          ]}
          style={{
            display: 'inline-block',
            width: 'calc(50% - 8px)',
            margin: '0 8px',
          }}
        >
          <Input placeholder="Country" />
        </Form.Item>
      </Form.Item>
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
