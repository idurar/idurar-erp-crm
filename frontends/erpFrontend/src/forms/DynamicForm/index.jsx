import { Input, Form, Checkbox, Select } from 'antd';
import { DatePicker } from '@/components/CustomAntd';
// mapping of our components
const componentMapping = {
  input: Input,
  password: Input.Password,
  checkbox: Checkbox,
  date: DatePicker,
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
  inputType = {},
  selectOptions = [],
  required = false,
  message = 'Field is required!',
}) {
  // dinamically select a component from componentMapping object
  const { Option } = Select;
  const Component = componentMapping[fieldType];

  return (
    <Form.Item label={label} name={name} rules={[{ required, message }, inputType]}>
      if (fieldType === "select")
      {
        <Select>
          {selectOptions.map((optionField) => (
            <Option key={optionField.key} value={optionField.key}>
              {optionField.value}
            </Option>
          ))}
        </Select>
      }
      else if(fieldType === "date"){<DatePicker format={'DD/MM/YYYY'} />}
      else {<Component />}
    </Form.Item>
  );
}

export default DynamicForm;
