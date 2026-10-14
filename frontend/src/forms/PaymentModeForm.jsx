import { Switch, Form, Input } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';

export default function PaymentModeForm() {
  const translate = useLanguage();

  return (
    <>
      <Form.Item
        label={translate('Payment Mode')}
        name="name"
        rules={[{ required: true, whitespace: true }]}
      >
        <Input placeholder="z. B. Überweisung" />
      </Form.Item>
      <Form.Item
        label={translate('enabled')}
        name="enabled"
        valuePropName="checked"
        initialValue={true}
        style={{ marginBottom: 0 }}
      >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>
    </>
  );
}
