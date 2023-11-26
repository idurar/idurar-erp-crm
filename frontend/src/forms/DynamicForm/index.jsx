import { DatePicker, Input, Form, Select, InputNumber, Switch } from 'antd';

import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import SelectAsync from '@/components/SelectAsync';

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

  const compunedComponent = {
    string: <Input autoComplete="off" />,
    number: <InputNumber min={0} style={{ width: '100%' }} />,
    boolean: <Switch checkedChildren={<CheckOutlined />} unCheckedChildren={<CloseOutlined />} />,
    date: <DatePicker placeholder={translate('select_date')} format={'DD/MM/YYYY'} />,
    select: (
      <Select
        options={field.options}
        mode={field.multiple && 'multiple'}
        defaultValue={field.defaultValue}
        style={{
          width: '100%',
        }}
      />
    ),
    selectAsync: (
      <SelectAsync
        entity={field.entity}
        displayLabels={field.displayLabels}
        loadDefault={field.loadDefault}
        withRedirect={field.loadDefault}
        urlToRedirect={field.urlToRedirect}
        redirectLabel={field.redirectLabel}
      ></SelectAsync>
    ),
  };

  return (
    <Form.Item
      label={field.label}
      name={field.name}
      rules={[
        {
          required: field.required || false,
        },
      ]}
      valuePropName={field.type === 'boolean' ? 'checked' : 'value'}
    >
      {compunedComponent[field.type]}
    </Form.Item>
  );
}

export default DynamicForm;
