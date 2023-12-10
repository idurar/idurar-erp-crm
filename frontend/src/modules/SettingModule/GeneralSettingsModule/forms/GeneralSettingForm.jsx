import { Input, Form, Select, Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

import languages from '@/locale/languages';
import useLanguage from '@/locale/useLanguage';

export default function GeneralSettingForm() {
  const translate = useLanguage();
  return (
    <>
      <Form.Item label={translate('Application Name')} name="idurar_app_name">
        <Input autoComplete="off" />
      </Form.Item>

      <Form.Item label={translate('language')} name="idurar_app_language">
        <Select
          showSearch
          placeholder={translate('select language')}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input.toLowerCase())}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
          }
        >
          {languages.map((language) => (
            <Select.Option
              key={language.value}
              value={language.value}
              label={language.label.toLowerCase()}
            >
              <div className="demo-option-label-item">
                <span role="img" aria-label={language.label}>
                  {language.icon}
                </span>
                {language.label}
              </div>
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item
        label={translate('Allow Registration')}
        name="idurar_registration_allowed"
        valuePropName="checked"
      >
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      </Form.Item>

      <Form.Item label={translate('Application Email')} name="idurar_app_email">
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item label={translate('Application URl')} name="idurar_base_url">
        <Input autoComplete="off" />
      </Form.Item>
    </>
  );
}
