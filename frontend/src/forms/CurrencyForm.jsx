import { Switch, Form, Input } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

export default function CurrencyForm() {
  const translate = useLanguage();

  return (
    <>
      <Form.Item
        label={translate('Currency Name')}
        name="name"
        rules={[
          {
            required: true,
            message: translate('Please input your currency name'),
          },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={translate('Symbol')}
        name="symbol"
        rules={[
          {
            required: true,
            message: translate('Please input your surname'),
          },
        ]}
        style={{
          display: 'inline-block',
          width: 'calc(50%)',
          paddingRight: '5px',
        }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={translate('Decimal Separator')}
        name="decimal_separator"
        rules={[
          {
            required: true,
          },
        ]}
        style={{
          display: 'inline-block',
          width: 'calc(50%)',
          paddingLeft: '5px',
        }}
      >
        <Input />
      </Form.Item>

      <Form.Item
        label={translate('Thousand Separator')}
        name="thousand_separator"
        rules={[
          {
            required: true,
          },
        ]}
        style={{
          display: 'inline-block',
          width: 'calc(50%)',
          paddingRight: '5px',
        }}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label={translate('Is Default Currency')}
        name="isDefault"
        rules={[
          {
            required: true,
          },
        ]}
        style={{
          display: 'inline-block',
          width: 'calc(50%)',
          paddingLeft: '5px',
        }}
        valuePropName="checked"
      >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>
    </>
  );
}
