import { useDispatch, useSelector } from 'react-redux';
import { Input, Form, Select, Switch } from 'antd';
import { CloseOutlined, CheckOutlined } from '@ant-design/icons';

import useLanguage from '@/locale/useLanguage';

export default function GeneralSettingForm() {
  const translate = useLanguage();
  const dispatch = useDispatch();

  return (
    <div>
      <Form.Item
        label={translate('Date Format')}
        name="idurar_app_date_format"
        rules={[
          {
            required: true,
          },
        ]}
      >
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
            { value: 'DD MMMM YYYY', label: 'DD MMMM YYYY' },
            { value: 'MM-YY-DD', label: 'MM-YY-DD' },
            { value: 'MMM. DD, YY', label: 'MMM. DD, YY' },
            { value: 'YYYY MM DD', label: 'YYYY MM DD' },
            { value: 'YY-MM-DD', label: 'YY-MM-DD' },
          ]}
        />
      </Form.Item>
      <Form.Item
        label={translate('email')}
        name="idurar_app_company_email"
        rules={[
          {
            required: true,
            type: 'email',
          },
        ]}
      >
        <Input />
      </Form.Item>
    </div>
  );
}
