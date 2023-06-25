import React, { useState, useEffect, useRef } from 'react';
import { request } from '@/request';
import useFetch from '@/hooks/useFetch';
import { Select } from 'antd';

export default function SelectAsync({
  entity,
  displayLabels = ['name'],
  outputValue = '_id',
  value,
  onChange,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectOptions, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(undefined);

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

  return (
    <Select
      loading={isLoading}
      disabled={isLoading}
      value={currentValue}
      onChange={(newValue) => {
        // setCurrentValue(newValue[outputValue] || newValue);
        if (onChange) {
          onChange(newValue[outputValue] || newValue);
        }
      }}
    >
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
