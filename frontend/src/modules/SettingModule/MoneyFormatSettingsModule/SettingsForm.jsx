import { useState, useEffect } from 'react';
import { Form, Input, InputNumber, Select, Switch } from 'antd';

import useLanguage from '@/locale/useLanguage';

import { currencyOptions } from '@/utils/currencyList';

import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectLangDirection } from '@/redux/translate/selectors';

export default function SettingsForm() {
  const translate = useLanguage();

  const [selectOptions, setOptions] = useState([]);

  const navigate = useNavigate();
  const handleSelectChange = (newValue) => {
    if (newValue === 'redirectURL') {
      navigate('/settings/currency');
    }
  };
  const asyncList = () => {
    return request.listAll({ entity: 'currency', options: { enabled: true } });
  };
  const { result, isLoading: fetchIsLoading, isSuccess } = useFetch(asyncList);
  useEffect(() => {
    isSuccess && setOptions(result);
  }, [isSuccess]);

  const optionsList = () => {
    const list = [];

    const value = 'redirectURL';
    const label = `+ Add New Currency`;

    list.push(...currencyOptions(selectOptions));
    list.push({ value, label });

    return list;
  };
  const langDirection=useSelector(selectLangDirection)

  return (
    <div style={{direction:langDirection}}>
      <Form.Item
        label={translate('Currency')}
        name="default_currency_code"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select
          showSearch
          loading={fetchIsLoading}
          disabled={fetchIsLoading}
          filterOption={(input, option) =>
            (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
          }
          options={optionsList()}
          onChange={handleSelectChange}
        ></Select>
      </Form.Item>
      {/* <Form.Item
        label={translate('Currency Symbol')}
        name="currency_symbol"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input value={currency.currency_symbol} />
      </Form.Item>

      <Form.Item
        label={translate('Currency Position')}
        name="currency_position"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Select>
          <Select.Option value="before">{translate('before')}</Select.Option>
          <Select.Option value="after">{translate('after')}</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item
        label={translate('Decimal Separator')}
        name="decimal_sep"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        label={translate('Thousand Separator')}
        name="thousand_sep"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <Input autoComplete="off" />
      </Form.Item>
      <Form.Item
        label={translate('Cent precision')}
        name="cent_precision"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <InputNumber min={0} />
      </Form.Item>
      <Form.Item
        label={translate('Zero Format')}
        name="zero_format"
        rules={[
          {
            required: true,
          },
        ]}
        valuePropName="checked"
      >
        <Switch />
      </Form.Item> */}
    </div>
  );
}
