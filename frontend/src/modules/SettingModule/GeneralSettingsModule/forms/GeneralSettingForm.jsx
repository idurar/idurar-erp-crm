import { Form, Input, Select, Tag } from 'antd';

import languages from '@/locale/languages';
import useLanguage from '@/locale/useLanguage';
import { accessTypes } from '@/utils/constants';
import usePermission from '@/hooks/usePermission';

export default function GeneralSettingForm() {
  const translate = useLanguage();
  const { hasPermission } = usePermission();
  const tagRender = (props) => {
    const { label, closable, onClose } = props;
    const onPreventMouseDown = (event) => {
      event.preventDefault();
      event.stopPropagation();
    };
    return (
      <Tag
        // color={tagColor[Math.floor(Math.random() * 11)]}
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
  return (
    <>
      <Form.Item
        label={translate('App Name')}
        name="app_name"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input autoComplete="off" disabled={!hasPermission(accessTypes.EDIT)} />
      </Form.Item>
      <Form.Item
        label={translate('language')}
        name="language"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          showSearch
          placeholder={translate('select language')}
          optionFilterProp="children"
          filterOption={(input, option) => (option?.label ?? '').includes(input)}
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
          }
          disabled={!hasPermission(accessTypes.EDIT)}
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
        label={translate('Allowed Role')}
        name="allowed_role"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          mode="tags"
          style={{
            width: '100%',
          }}
          tokenSeparators={[',']}
          tagRender={tagRender}
          disabled={!hasPermission(accessTypes.EDIT)}
        ></Select>
      </Form.Item>
    </>
  );
}
