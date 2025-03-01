import { Form, Input, Select } from 'antd';

import useLanguage from '@/locale/useLanguage';

export default function LeadForm() {
  const translate = useLanguage();
  return (
    <>
      <Form.Item
        label={translate('first name')}
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
        label={translate('last name')}
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
        label={translate('email')}
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
        label={translate('phone')}
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
        label={translate('company')}
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
        label={translate('position in company')}
        name="jobTitle"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item label={translate('address')} name="address">
        <Input />
      </Form.Item>

      <Form.Item label={translate('country')} name="country">
        <Input />
      </Form.Item>

      <Form.Item
        label={translate('status')}
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
            { value: 'new', label: translate('new') },
            { value: 'reached', label: translate('reached') },
            { value: 'interested', label: translate('interested') },
            { value: 'not interested', label: translate('not interested') },
          ]}
        ></Select>
      </Form.Item>

      <Form.Item label={translate('notes')} name="notes">
        <Input />
      </Form.Item>

      <Form.Item label={translate('source')} name="source">
        <Input placeholder="ex: linkedin, website, ads..." />
      </Form.Item>
    </>
  );
}
