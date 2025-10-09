import { useState, useEffect } from 'react';
import { Select, Space } from 'antd';
import { request } from '@/request';
import errorHandler from '@/request/errorHandler';

const { Option } = Select;

const asyncList = (entity) => {
  return request.list({ entity });
};

const asyncFilter = (entity, options) => {
  return request.filter({ entity, options });
};

const MultiStepSelectAsync = ({
  firstSelectProps = {},
  secondSelectProps = {},
  firstSelectIdKey = '_id',
  firstSelectValueKey = 'value',
  firstSelectLabelKey = 'label',
  secondSelectIdKey = '_id',
  secondSelectValueKey = 'value',
  secondSelectLabelKey = 'label',
  entityName,
  subEntityName = 'items',
  value = {},
  onChange,
  style,
}) => {
  const firstSelectedOption = value.firstSelectedOption;
  const [firstSelectOptions, setFirstSelectOptions] = useState([]);
  const [secondSelectOptions, setSecondSelectOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        if (firstSelectedOption) {
          const data = await asyncFilter(entityName, {
            filter: '_id',
            equal: firstSelectedOption[firstSelectIdKey],
          });

          setSecondSelectOptions(data?.result?.[0]?.[subEntityName]);
          return;
        }
        const data = await asyncList(entityName);
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
    <Space direction="vertical" style={style}>
      <Select
        placeholder="Select an option"
        style={{ width: 200 }}
        {...firstSelectProps}
        loading={!firstSelectedOption ? loading : false}
        onChange={(value) => {
          if (onChange) {
            onChange({
              firstSelectedOption: firstSelectOptions.find(
                (option) => option[firstSelectValueKey] === value
              ),
            });
          }
        }}
      >
        {firstSelectOptions.map((option) => (
          <Option key={option[firstSelectIdKey]} value={option[firstSelectValueKey]}>
            {option[firstSelectLabelKey]}
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
                  (option) => option[secondSelectValueKey] === value
                ),
              });
            }
          }}
        >
          {secondSelectOptions.map((option) => (
            <Option key={option[secondSelectIdKey]} value={option[secondSelectValueKey]}>
              {option[secondSelectLabelKey]}
            </Option>
          ))}
        </Select>
      )}
    </Space>
  );
};

export default MultiStepSelectAsync;
