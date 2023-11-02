import { Input, Form, Checkbox, Select, InputNumber } from 'antd';
import { DatePicker } from 'antd';
// mapping of our components
const componentMapping = {
  input: Input,
  number: InputNumber,
  password: Input.Password,
  checkbox: Checkbox,
};

function DynamicForm({ fields }) {
  return (
    <>
      {fields.map((fieldElement) => (
        <FormElement {...fieldElement} />
      ))}
    </>
  );
}

function FormElement({
  fieldType,
  label,
  name,
  isMultiSelect = false,
  selectOptions = [],
  required = false,
  fieldProps = {},
  message = 'Field is required!',
}) {
  // dinamically select a component from componentMapping object
  const { Option } = Select;
  const Component = componentMapping[fieldType];

  return (
    <Form.Item label={label} name={name} rules={[{ required, message }]}>
      if (fieldType === "select")
      {
        <Select {...fieldProps}>
          {selectOptions.map((optionField) => (
            <Option key={optionField.key} value={optionField.key}>
              {optionField.value}
            </Option>
          ))}
        </Select>
      }
      else if(fieldType === "date"){<DatePicker format={'DD/MM/YYYY'} {...fieldProps} />}
      else {<Component {...fieldProps} />}
    </Form.Item>
  );
}

export default DynamicForm;
