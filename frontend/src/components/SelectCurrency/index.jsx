import { useDispatch, useSelector } from 'react-redux';

import { settingsAction } from '@/redux/settings/actions';

import { Select, Form } from 'antd';

import { currencyOptions } from '@/utils/currencyList';

import { selectMoneyFormat } from '@/redux/settings/selectors';

import { useState, useEffect } from 'react';
import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import { useNavigate } from 'react-router-dom';
import useLanguage from '@/locale/useLanguage';

const SelectCurrency = () => {
  const translate = useLanguage();
  const dispatch = useDispatch();
  const [selectOptions, setOptions] = useState([]);

  const navigate = useNavigate();

  const asyncList = () => {
    return request.listAll({ entity: 'currency', options: { enabled: true } });
  };
  const { result, isLoading: fetchIsLoading, isSuccess } = useFetch(asyncList);
  useEffect(() => {
    isSuccess && setOptions(result);
  }, [isSuccess]);

  const money_format_settings = useSelector(selectMoneyFormat);

  const updateCurrency = (value) => {
    const currency = selectOptions.find((x) => x.currency_code === value);

    dispatch(
      settingsAction.updateCurrency({
        data: { default_currency_code: currency.currency_code },
      })
    );
  };

  const handleSelectChange = (newValue) => {
    if (newValue === 'redirectURL') {
      navigate('/settings/currency');
    }
  };

  const optionsList = () => {
    const list = [];

    const value = 'redirectURL';
    const label = `+ Add New Currency`;

    list.push(...currencyOptions(selectOptions));
    list.push({ value, label });

    return list;
  };

  return (
    <Form.Item
      label={translate('currency')}
      name="currency"
      rules={[
        {
          required: true,
        },
      ]}
      initialValue={money_format_settings.default_currency_code}
    >
      <Select
        showSearch
        loading={fetchIsLoading}
        filterOption={(input, option) =>
          (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
        }
        filterSort={(optionA, optionB) =>
          (optionA?.label ?? '').toLowerCase().startsWith((optionB?.label ?? '').toLowerCase())
        }
        options={optionsList()}
        onSelect={updateCurrency}
        onChange={handleSelectChange}
      ></Select>
    </Form.Item>
  );
};

export default SelectCurrency;
