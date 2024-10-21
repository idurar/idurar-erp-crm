import { Form, Input, DatePicker, Select } from 'antd';
import { validatePhoneNumber } from '@/utils/helpers';
import { getRawValue } from 'react-phone-hooks';
import { useDate } from '@/settings';

import useLanguage from '@/locale/useLanguage';
import PhoneInput from 'antd-phone-input';

export default function EmployeeForm() {
  const translate = useLanguage();
  const { dateFormat } = useDate();

  return (
    <>
      <Form.Item
        name="name"
        label={translate('first name')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="surname"
        label={translate('last name')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="birthday"
        label={translate('birthday')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <DatePicker placeholder={translate('select_date')} format={dateFormat} />
      </Form.Item>
      <Form.Item
        name="birthplace"
        label={translate('birthplace')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="gender"
        label={translate('gender')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select>
          <Select.Option value="men">{translate('men')}</Select.Option>
          <Select.Option value="women">{translate('women')}</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        name="email"
        label={translate('email')}
        rules={[
          {
            type: 'email',
          },
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="phone"
        normalize={getRawValue}
        label={translate('phone')}
        rules={[
          {
            required: true,
          },
          {
            validator: validatePhoneNumber,
          },
        ]}
      >
        <PhoneInput />
      </Form.Item>
      <Form.Item
        name="department"
        label={translate('Department')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="position"
        label={translate('Position')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="address"
        label={translate('Address')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        name="state"
        label={translate('State')}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input />
      </Form.Item>
    </>
  );
}
