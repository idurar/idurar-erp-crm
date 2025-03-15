import { Form, Input } from 'antd';
import useLanguage from '@/locale/useLanguage';
const { TextArea } = Input;

const formItems = [
  {
    label: 'invoice_settings_invoice_pdf_footer',
    settingKey: 'invoice_settings_invoice_pdf_footer',
    valueType: 'string',
  },
  {
    label: 'quote_settings_quote_pdf_footer',
    settingKey: 'quote_settings_quote_pdf_footer',
    valueType: 'string',
  },
  {
    label: 'offer_settings_offer_pdf_footer',
    settingKey: 'offer_settings_offer_pdf_footer',
    valueType: 'string',
  },
];

export default function SettingForm() {
  const translate = useLanguage();

  return (
    <div>
      {formItems.map((item) => {
        return (
          <Form.Item
            key={item.settingKey}
            label={item.label ? translate(item.label) : translate(item.settingKey)}
            name={item.settingKey}
            rules={[
              {
                required: true,
              },
            ]}
            valuePropName="value"
          >
            <TextArea rows="3" />
          </Form.Item>
        );
      })}
    </div>
  );
}
