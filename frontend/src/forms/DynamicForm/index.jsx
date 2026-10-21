import { useState } from 'react';
import { DatePicker, Input, Form, Select, InputNumber, Switch, Tag, Typography } from 'antd';

import { CloseOutlined, CheckOutlined } from '@ant-design/icons';
import useLanguage from '@/locale/useLanguage';
import { useMoney, useDate } from '@/settings';
import AutoCompleteAsync from '@/components/AutoCompleteAsync';
import SelectAsync from '@/components/SelectAsync';

import { countryList } from '@/utils/countryList';

export default function DynamicForm({ fields, isUpdateForm = false }) {
  const [feedback, setFeedback] = useState();

  return (
    <div>
      {Object.keys(fields).map((key) => {
        let field = fields[key];

        if ((isUpdateForm && !field.disableForUpdate) || !field.disableForForm) {
          field.name = field.dataPath || key;
          if (!field.label) field.label = key;
          if (field.hasFeedback)
            return (
              <FormElement feedback={feedback} setFeedback={setFeedback} key={key} field={field} />
            );
          else if (feedback && field.feedback) {
            if (feedback == field.feedback) return <FormElement key={key} field={field} />;
          } else {
            return <FormElement key={key} field={field} />;
          }
        }
      })}
    </div>
  );
}

function FormElement({ field, feedback, setFeedback }) {
  const translate = useLanguage();
  const money = useMoney();
  const { dateFormat } = useDate();

  const { TextArea } = Input;

  const SelectComponent = () => (
    <Form.Item
      label={translate(field.label)}
      name={field.name}
      initialValue={field.defaultValue}
      rules={[
        {
          required: field.required || false,
          type: filedType[field.type] ?? 'any',
        },
      ]}
    >
      <Select
        showSearch={field.showSearch}
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => {
          return (
            <Select.Option key={option.value} value={option.value}>
              {option.label}
            </Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );

  const SelectWithTranslationComponent = () => (
    <Form.Item
      label={translate(field.label)}
      name={field.name}
      initialValue={field.defaultValue}
      rules={[
        {
          required: field.required || false,
          type: filedType[field.type] ?? 'any',
        },
      ]}
    >
      <Select
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => {
          return (
            <Select.Option key={option.value} value={option.value}>
              <Tag bordered={false} color={option.color}>
                {translate(option.label)}
              </Tag>
            </Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );
  const SelectWithFeedbackComponent = ({ feedbackValue, lanchFeedback }) => (
    <Form.Item
      label={translate(field.label)}
      name={field.name}
      initialValue={field.defaultValue}
      rules={[
        {
          required: field.required || false,
          type: filedType[field.type] ?? 'any',
        },
      ]}
    >
      <Select
        onSelect={(value) => lanchFeedback(value)}
        value={feedbackValue}
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {translate(option.label)}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
  const ColorComponent = () => (
    <Form.Item
      label={translate(field.label)}
      name={field.name}
      initialValue={field.defaultValue}
      rules={[
        {
          required: field.required || false,
          type: filedType[field.type] ?? 'any',
        },
      ]}
    >
      <Select
        showSearch
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
        }
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => {
          return (
            <Select.Option key={option.value} value={option.value} label={option.label}>
              <Tag bordered={false} color={option.color}>
                {option.label}
              </Tag>
            </Select.Option>
          );
        })}
      </Select>
    </Form.Item>
  );
  const TagComponent = () => (
    <Form.Item
      label={translate(field.label)}
      name={field.name}
      initialValue={field.defaultValue}
      rules={[
        {
          required: field.required || false,
          type: filedType[field.type] ?? 'any',
        },
      ]}
    >
      <Select
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            <Tag bordered={false} color={option.color}>
              {translate(option.label)}
            </Tag>
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
  const ArrayComponent = () => (
    <Form.Item
      label={translate(field.label)}
      name={field.name}
      initialValue={field.defaultValue}
      rules={[
        {
          required: field.required || false,
          type: filedType[field.type] ?? 'any',
        },
      ]}
    >
      <Select
        mode={'multiple'}
        style={{
          width: '100%',
        }}
      >
        {field.options?.map((option) => (
          <Select.Option key={option.value} value={option.value}>
            {option.label}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
  const CountryComponent = () => (
    <Form.Item
      label={translate(field.label)}
      name={field.name}
      initialValue={field.defaultValue}
      rules={[
        {
          required: field.required || false,
          type: filedType[field.type] ?? 'any',
        },
      ]}
    >
      <Select
        showSearch
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
        }
        style={{
          width: '100%',
        }}
      >
        {countryList.map((language) => (
          <Select.Option
            key={language.value}
            value={language.value}
            label={translate(language.label)}
          >
            {language?.icon && language?.icon + ' '}
            {translate(language.label)}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );

  const SearchComponent = () => {
    return (
      <Form.Item
        label={translate(field.label)}
        name={field.name}
        rules={[
          {
            required: field.required || false,
            type: filedType[field.type] ?? 'any',
          },
        ]}
      >
        <AutoCompleteAsync
          entity={field.entity}
          displayLabels={field.displayLabels}
          searchFields={field.searchFields}
          outputValue={field.outputValue}
          withRedirect={field.withRedirect}
          urlToRedirect={field.urlToRedirect}
          redirectLabel={field.redirectLabel}
        ></AutoCompleteAsync>
      </Form.Item>
    );
  };

  const formItemComponent = {
    select: <SelectComponent />,
    selectWithTranslation: <SelectWithTranslationComponent />,
    selectWithFeedback: (
      <SelectWithFeedbackComponent lanchFeedback={setFeedback} feedbackValue={feedback} />
    ),
    color: <ColorComponent />,

    tag: <TagComponent />,
    array: <ArrayComponent />,
    country: <CountryComponent />,
    search: <SearchComponent />,
  };

  const compunedComponent = {
    string: (
      <Input
        autoComplete="off"
        maxLength={field.maxLength}
        placeholder={field.placeholder ? translate(field.placeholder) : undefined}
      />
    ),
    url: <Input addonBefore="http://" autoComplete="off" placeholder="www.example.com" />,
    textarea: <TextArea rows={4} />,
    email: <Input autoComplete="off" placeholder="email@example.com" />,
    number: <InputNumber style={{ width: '100%' }} decimalSeparator="," />,
    phone: <Input style={{ width: '100%' }} placeholder="+1 123 456 789" />,
    boolean: (
      <Switch
        checkedChildren={<CheckOutlined />}
        unCheckedChildren={<CloseOutlined />}
      />
    ),
    date: (
      <DatePicker
        placeholder={translate('select_date')}
        style={{ width: '100%' }}
        format={dateFormat}
      />
    ),
    async: (
      <SelectAsync
        entity={field.entity}
        displayLabels={field.displayLabels}
        outputValue={field.outputValue}
        loadDefault={field.loadDefault}
        withRedirect={field.withRedirect}
        urlToRedirect={field.urlToRedirect}
        redirectLabel={field.redirectLabel}
      ></SelectAsync>
    ),

    currency: (
      <InputNumber
        className="moneyInput"
        min={0}
        controls={false}
        addonAfter={money.currency_position === 'after' ? money.currency_symbol : undefined}
        addonBefore={money.currency_position === 'before' ? money.currency_symbol : undefined}
      />
    ),
  };

  const filedType = {
    string: 'string',
    textarea: 'string',
    number: 'number',
    phone: 'string',
    //boolean: 'boolean',
    // method: 'method',
    // regexp: 'regexp',
    // integer: 'integer',
    // float: 'float',
    // array: 'array',
    // object: 'object',
    // enum: 'enum',
    // date: 'date',
    url: 'url',
    website: 'url',
    email: 'email',
  };

  const customFormItem = formItemComponent[field.type];
  let renderComponent = compunedComponent[field.type];

  if (!renderComponent) {
    renderComponent = compunedComponent['string'];
  }

  if (customFormItem) return <>{customFormItem}</>;
  else {
    return (
      <>
        {field.groupTitle && (
          <Typography.Title level={5} style={{ marginTop: 8, marginBottom: 12 }}>
            {translate(field.groupTitle)}
          </Typography.Title>
        )}
        <Form.Item
          label={field.hideLabel ? null : translate(field.label)}
          name={field.name}
          initialValue={field.type === 'boolean' ? (field.defaultValue ?? true) : field.defaultValue}
          rules={[
            {
              required: field.required || false,
              type: filedType[field.type] ?? 'any',
            },
          ]}
          valuePropName={field.type === 'boolean' ? 'checked' : 'value'}
        >
          {renderComponent}
        </Form.Item>
      </>
    );
  }
}
