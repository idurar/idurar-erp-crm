import React, { useState, useEffect } from 'react';
import { Select, Space } from 'antd';
import { request } from '@/request';
import errorHandler from '@/request/errorHandler';

const { Option } = Select;

const asyncList = (entity, options) => {
  return request.list({ entity, options });
};

const MultiStepSelectAsync = ({
  firstSelectProps = {},
  secondSelectProps = {},
  entity,
  value = {},
  onChange,
  idKey = '_id',
  valueKey = 'value',
  labelKey = 'label',
}) => {
  const firstSelectedOption = value.firstSelectedOption;
  const [firstSelectOptions, setFirstSelectOptions] = useState([]);
  const [secondSelectOptions, setSecondSelectOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const data = await asyncList(entity, { id: firstSelectedOption[idKey] });
        if (firstSelectedOption) {
          setSecondSelectOptions(data.result);
          return;
        }
        setFirstSelectOptions(data.result);
      } catch (error) {
        errorHandler(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [firstSelectedOption]);

  return (
    <Space direction="vertical">
      <Select
        placeholder="Select an option"
        style={{ width: 200 }}
        {...firstSelectProps}
        loading={!firstSelectedOption ? loading : false}
        onChange={(value) => {
          if (onChange) {
            onChange({
              firstSelectedOption: firstSelectOptions.find((option) => option[valueKey] === value),
            });
          }
        }}
      >
        {firstSelectOptions.map((option) => (
          <Option key={option[idKey]} value={option[valueKey]}>
            {option[labelKey]}
          </Option>
        ))}
      </Select>
      {firstSelectedOption && (
        <Select
          placeholder="Select another option"
          loading={loading}
          style={{ width: 200 }}
          {...secondSelectProps}
          onChange={(value) => {
            if (onChange) {
              onChange({
                firstSelectedOption,
                secondSelectedOption: secondSelectOptions.find(
                  (option) => option[valueKey] === value
                ),
              });
            }
          }}
        >
          {secondSelectOptions.map((option) => (
            <Option key={option[idKey]} value={option[valueKey]}>
              {option[labelKey]}
            </Option>
          ))}
        </Select>
      )}
    </Space>
  );
};

export default MultiStepSelectAsync;
