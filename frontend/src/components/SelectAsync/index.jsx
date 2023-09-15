import React, { useState, useEffect, useRef } from 'react';
import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import { Select } from 'antd';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { PlusCircleOutlined } from '@ant-design/icons';

export default function SelectAsync({
  entity,
  displayLabels = ['name'],
  outputValue = '_id',
  value,
  onChange,
  redirectLabel = '',
  withRedirect = false,
  urlToRedirect = '/',
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectOptions, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(undefined);

  const history = useHistory();

  const asyncList = () => {
    return request.list({ entity });
  };
  const { result, isLoading: fetchIsLoading, isSuccess } = useFetch(asyncList);
  useEffect(() => {
    isSuccess ? setOptions(result) : setOptions([]);
    setIsLoading(fetchIsLoading);
  }, [fetchIsLoading]);

  const labels = (optionField) => {
    return displayLabels.map((x) => optionField[x]).join(' ');
  };
  useEffect(() => {
    // this for update Form , it's for setField
    if (value) {
      setCurrentValue(value[outputValue] || value); // set nested value or value
      onChange(value[outputValue] || value);
    }
  }, [value]);

  const handleSelectChange = (newValue) => {
    if (newValue === 'redirectURL') {
      // Navigate to another page when "Add payment" is selected
      history.push(urlToRedirect);
    } else {
      // Handle other select options
      if (onChange) {
        onChange(newValue[outputValue] || newValue);
      }
    }
  };

  return (
    <Select
      loading={isLoading}
      disabled={isLoading}
      value={currentValue}
      onChange={handleSelectChange}
    >
      {selectOptions.length === 0 && withRedirect && (
        <Select.Option key="redirectURL" value="redirectURL">
          <PlusCircleOutlined /> {redirectLabel}
        </Select.Option>
      )}
      {selectOptions.map((optionField) => (
        <Select.Option
          key={optionField[outputValue] || optionField}
          value={optionField[outputValue] || optionField}
        >
          {labels(optionField)}
        </Select.Option>
      ))}
    </Select>
  );
}
