import { Form, Input, Select } from 'antd';

import useLanguage from '@/lang/useLanguage';

export default function LeadForm() {
  const getLang = useLanguage();
  return (
    <>
      <Form.Item
        label={getLang('first name')}
        name="firstName"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={getLang('last name')}
        name="lastName"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={getLang('email')}
        name="email"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={getLang('phone')}
        name="phone"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input type="tel" />
      </Form.Item>

      <Form.Item
        label={getLang('company')}
        name="company"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={getLang('position in company')}
        name="jobTitle"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label={getLang('address')} name="address">
        <Input />
      </Form.Item>

      <Form.Item label={getLang('country')} name="country">
        <Input />
      </Form.Item>

      <Form.Item
        label={getLang('status')}
        name="status"
        rules={[
          {
            required: false,
          },
        ]}
        initialValue={'new'}
      >
        <Select
          options={[
            { value: 'new', label: getLang('new') },
            { value: 'reached', label: getLang('reached') },
            { value: 'interested', label: getLang('interested') },
            { value: 'not interested', label: getLang('not interested') },
          ]}
        ></Select>
      </Form.Item>

      <Form.Item label={getLang('note')} name="note">
        <Input />
      </Form.Item>

      <Form.Item label={getLang('source')} name="source">
        <Input placeholder="ex: linkedin, website, ads..." />
      </Form.Item>
    </>
  );
}
