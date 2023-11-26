import { DatePicker, Input, Form, Select, InputNumber, Switch } from 'antd';

import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
// mapping of our components

function DynamicForm({ fields }) {
  return (
    <>
      {fields.map((field) => (
        <FormElement key={field.name} field={field} />
      ))}
    </>
  );
}

function FormElement({ field }) {
  const translate = useLanguage();

  return (
    <Form.Item
      label={field.label}
      name={field.name}
      rules={[
        {
          required: field.isRequired || false,
        },
      ]}
      valuePropName={field.type === 'boolean' ? 'checked' : 'value'}
    >
      {field.type === 'string' && <Input autoComplete="off" />}
      {field.type === 'number' && <InputNumber min={0} style={{ width: '100%' }} />}
      {field.type === 'boolean' && (
        <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />
      )}
      {field.type === 'date' && (
        <DatePicker placeholder={translate('select_date')} format={'DD/MM/YYYY'} />
      )}
      {field.type === 'select' && (
        <Select
          options={field.options}
          defaultValue={field.defaultValue}
          style={{
            width: '100%',
          }}
        />
      )}
    </Form.Item>
  );
}

export default DynamicForm;
