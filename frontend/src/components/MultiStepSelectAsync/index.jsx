import React, { useState, useEffect } from 'react';
import { Select, Space } from 'antd';
import { request } from '@/request';
import errorHandler from '@/request/errorHandler';

const { Option } = Select;

const asyncList = (entity, options) => {
  return request.list({ entity, options });
};

const MultiStepSelectAsync = ({
  firstSelectProps,
  secondSelectProps,
  entity,
  firstSelectValue,
  onChange,
  firstSelectOptions = [],
}) => {
  const [secondSelectOptions, setSecondSelectOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (firstSelectValue) {
      async function fetchData() {
        try {
          const data = await asyncList(entity, { firstSelectValue });
          setSecondSelectOptions(data.result);
        } catch (error) {
          errorHandler(error);
        } finally {
          setLoading(false);
        }
      }
      fetchData();
    }
  }, [firstSelectValue]);

  return (
    <Space direction="vertical">
      <Select
        placeholder="Select an option"
        style={{ width: 200 }}
        {...firstSelectProps}
        onChange={(value) => onChange({ firstSelectValue: value })}
      >
        {firstSelectOptions.map((option) => (
          <Option key={option.value} value={option.value}>
            {option.label}
          </Option>
        ))}
      </Select>
      {firstSelectValue && (
        <Select
          placeholder="Select another option"
          loading={loading}
          style={{ width: 200 }}
          {...secondSelectProps}
          onChange={(value) => onChange({ firstSelectValue, secondSelectValue: value })}
        >
          {secondSelectOptions.map((option) => (
            <Option key={option.value} value={option.value}>
              {option.label}
            </Option>
          ))}
        </Select>
      )}
    </Space>
  );
};

export default MultiStepSelectAsync;
