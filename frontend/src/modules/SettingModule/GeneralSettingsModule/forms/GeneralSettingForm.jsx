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

      <Form.Item label={translate('Date Format')} name="idurar_app_date_format">
        <Select
          showSearch
          style={{
            width: '100%',
          }}
          options={[
            { value: 'DD/MM/YYYY', label: 'DD/MM/YYYY' },
            { value: 'MM/DD/YYYY', label: 'MM/DD/YYYY' },
            { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
            { value: 'DD.MM.YYYY', label: 'DD.MM.YYYY' },
            { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD' },
            { value: 'YYYY-DD-MM', label: 'YYYY-DD-MM' },
            { value: 'YYYY.MM.DD', label: 'YYYY.MM.DD' },
            { value: 'MM/YYYY/DD', label: 'MM/YYYY/DD' },
            { value: 'MM.DD.YYYY', label: 'MM.DD.YYYY' },
            { value: 'DD/YYYY/MM', label: 'DD/YYYY/MM' },
            { value: 'DD-YYYY-MM', label: 'DD-YYYY-MM' },
            { value: 'DD.YYYY.MM', label: 'DD.YYYY.MM' },
            { value: 'YYYY/DD/MM', label: 'YYYY/DD/MM' },
            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
            { value: 'MM.DD.YY', label: 'MM.DD.YY' },
            { value: 'DD-MMM-YY', label: 'DD-MMM-YY' },
            { value: 'YY/MM/DD', label: 'YY/MM/DD' },
            { value: 'DD MMM YYYY', label: 'DD MMM YYYY' },
            { value: 'MMM DD, YYYY', label: 'MMM DD, YYYY' },
            { value: 'DD-MM-YY', label: 'DD-MM-YY' },
            { value: 'MM-DD-YY', label: 'MM-DD-YY' },
            { value: 'YY.MM.DD', label: 'YY.MM.DD' },
            { value: 'MMM DD YY', label: 'MMM DD YY' },
            { value: 'DD MMM YY', label: 'DD MMM YY' },
            { value: 'YYYY/MM/DD', label: 'YYYY/MM/DD' },
            { value: 'MM.YYYY.DD', label: 'MM.YYYY.DD' },
            { value: 'YYYY/DD/MM', label: 'YYYY/DD/MM' },
            { value: 'MM-DD-YYYY', label: 'MM-DD-YYYY' },
            { value: 'DD-MM-YYYY', label: 'DD-MM-YYYY' },
            { value: 'YYYY-MM-DD', label: 'YYYY-MM-DD' },
            { value: 'YY/DD/MM', label: 'YY/DD/MM' },
            { value: 'MM-DD', label: 'MM-DD' },
            { value: 'DD-MM', label: 'DD-MM' },
            { value: 'MM/YY', label: 'MM/YY' },
            { value: 'YYYY-MMM-DD', label: 'YYYY-MMM-DD' },
            { value: 'MM/DD', label: 'MM/DD' },
            { value: 'DD.MM.YY', label: 'DD.MM.YY' },
            { value: 'MM/YY/DD', label: 'MM/YY/DD' },
            { value: 'MMMM DD, YYYY', label: 'MMMM DD, YYYY' },
            { value: 'DDth MMMM YYYY', label: 'DDth MMMM YYYY' },
            { value: 'MM-YY-DD', label: 'MM-YY-DD' },
            { value: 'MMM. DD, YY', label: 'MMM. DD, YY' },
            { value: 'YYYY MM DD', label: 'YYYY MM DD' },
            { value: 'YY-MM-DD', label: 'YY-MM-DD' },
          ]}
        />
      </Form.Item>

      <Form.Item label={translate('Application Email')} name="idurar_app_email">
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item label={translate('Server URl')} name="idurar_server_url">
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item label={translate('Application URl')} name="idurar_base_url">
        <Input autoComplete="off" />
      </Form.Item>
    </>
  );
}
