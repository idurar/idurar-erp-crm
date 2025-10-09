import { Switch, Form, Input, Button, Space, Select } from 'antd';
import { CloseOutlined, CheckOutlined, MinusCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectCurrentItem } from '@/redux/crud/selectors';
import { useState } from 'react';

import useLanguage from '@/locale/useLanguage';

export function SelectType() {
  const translate = useLanguage();

  return (
    <Form.List name="settingValue" initialValue={[{ Label: '', Value: '' }]}>
      {(fields, { add, remove }) => (
        <>
          {fields.map((field) => (
            <Space key={field.key} align="center">
              <Form.Item
                {...field}
                label={translate('Label')}
                name={[field.name, 'label']}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                {...field}
                label={translate('Value')}
                name={[field.name, 'Value']}
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>

              <MinusCircleOutlined onClick={() => remove(field.name)} />
            </Space>
          ))}

          <Form.Item>
            <Button type="dashed" onClick={() => add()} block icon={<PlusOutlined />}>
              Add Select Options
            </Button>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
}

export default function AdvancedSettingsForm({ isUpdateForm = false }) {
  const translate = useLanguage();
  const { result } = useSelector(selectCurrentItem);
  const [type, setType] = useState(null);
  const options = ['number', 'text', 'date'];

  const handleChange = (value) => {
    setType(value);
  };
  return (
    <>
      <Form.Item
        label={translate('Setting Category')}
        name="settingCategory"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder={translate('Select')}
          options={[
            {
              value: 'app_settings',
              label: translate('App Settings'),
            },
            {
              value: 'crm_settings',
              label: translate('CRM Settings'),
            },

            {
              value: 'finance_settings',
              label: translate('Finance Settings'),
            },
            {
              value: 'company_settings',
              label: translate('Company Settings'),
            },
            {
              value: 'money_format_settings',
              label: translate('Money Format Settings'),
            },
          ]}
        />
      </Form.Item>
      <Form.Item
        label={translate('Setting Name')}
        name="settingKey"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input type="text" />
      </Form.Item>

      <Form.Item
        label={translate('type')}
        name="settingType"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          placeholder={translate('Select')}
          onChange={handleChange}
          options={[
            {
              value: 'text',
              label: 'Text',
            },
            {
              value: 'number',
              label: 'Number',
            },

            {
              value: 'date',
              label: 'Date',
            },
            {
              value: 'select',
              label: 'Select',
            },
          ]}
        />
      </Form.Item>
      {type ? (
        type === 'select' ? (
          <SelectType />
        ) : (
          <Form.Item
            label="Value"
            name="settingValue"
            rules={[
              {
                required: true,
              },
            ]}
          >
            <Input type={type} />
          </Form.Item>
        )
      ) : null}

      <Form.Item
        label={translate('enabled')}
        name="enabled"
        style={{
          display: 'inline-block',
          width: '100%',
          paddingRight: '5px',
        }}
        valuePropName="checked"
        initialValue={true}
      >
        <Switch
          disabled={result ? result.isCoreSetting : false}
          checkedChildren={<CheckOutlined />}
          unCheckedChildren={<CloseOutlined />}
        />
      </Form.Item>
    </>
  );
}
