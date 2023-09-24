import { Input, Form, Checkbox, Tag, Select, InputNumber } from 'antd';
import { tagColor } from '@/utils';
import { DatePicker } from '@/components/CustomAntd';
// mapping of our components
const componentMapping = {
  string: Input,
  number: InputNumber,
};

function DynamicForm({ fields = [] }) {
  return (
    <>
      {fields.map((fieldElement, index) => (
        <Form.Item
          key={fieldElement.fieldName + index}
          label={fieldElement.label}
          name={fieldElement.fieldName}
          rules={[{ required: fieldElement.required, message: fieldElement.message }]}
        >
          <FormElement {...fieldElement} />
        </Form.Item>
      ))}
    </>
  );
}

const tagRender = (props) => {
  const { label, value, closable, onClose } = props;

  const onPreventMouseDown = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };
  return (
    <Tag
      // color={tagColor[Number(value)]}
      onMouseDown={onPreventMouseDown}
      closable={closable}
      onClose={onClose}
      style={{
        marginRight: 3,
      }}
    >
      {label}
    </Tag>
  );
};

function FormElement({ fieldType, selectOptions = [] }) {
  // dinamically select a component from componentMapping object
  const { Option } = Select;
  const Component = componentMapping[fieldType];
  const colorList = [...tagColor];

  if (fieldType === 'string' || fieldType === 'number') {
    return <Component />;
  }
  return (
    <Select
      mode="tags"
      style={{
        width: '100%',
      }}
      tokenSeparators={[',']}
      tagRender={tagRender}
    >
      {selectOptions.map((optionField, index) => (
        <Option key={optionField.key} value={optionField.value}>
          {optionField.value}
        </Option>
      ))}
    </Select>
  );
}

export default DynamicForm;
