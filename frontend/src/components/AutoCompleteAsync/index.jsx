import { useState, useEffect, useRef } from 'react';
import { request } from '@/request';
import useOnFetch from '@/hooks/useOnFetch';
import { useDebounce } from 'react-use';
import { Select, Empty } from 'antd';

export default function AutoCompleteAsync({
  entity,
  displayLabels,
  searchFields,
  outputValue = '_id',
  value, /// this is for update
  onChange, /// this is for update
}) {
  const [selectOptions, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(undefined);
  const [searching, setSearching] = useState(false);
  const [valToSearch, setValToSearch] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');
  const [dropDownData, setDropDownData] = useState([]);

  const isUpdating = useRef(true);
  const isSearching = useRef(false);

  const [, cancel] = useDebounce(
    () => {
      //  setState("Typing stopped");
      setDebouncedValue(valToSearch);
    },
    500,
    [valToSearch]
  );

  const asyncSearch = (options) => {
    return request.search({ entity, options });
  };

  let { onFetch, result, isSuccess, isLoading } = useOnFetch();

  const labels = (optionField) => {
    return displayLabels.map((x) => optionField[x]).join(' ');
  };

  useEffect(() => {
    if (debouncedValue != '') {
      const options = {
        q: debouncedValue,
        fields: searchFields,
      };
      onFetch(() => asyncSearch(options));
    }

    return () => {
      cancel();
    };
  }, [debouncedValue]);

  const onSearch = (searchText) => {
    setDropDownData([]);
    if (searchText != '') {
      isSearching.current = true;
      setSearching(true);
      setOptions([]);
      setCurrentValue(undefined);
      setValToSearch(searchText);
    }
  };

  const onDropDownOpen = async () => {
    if (!searching) {
      if (!dropDownData.length) {
        // Only fetch data if it's not already loaded
        const { result } = await request.listAll({ entity });
        setDropDownData(result);
      }
    }
  };

  useEffect(() => {
    if (isSearching.current) {
      if (isSuccess) {
        setOptions(result);
      } else {
        setSearching(false);
        setCurrentValue(undefined);
        setOptions([]);
      }
    }
  }, [isSuccess, result]);

  useEffect(() => {
    // this for update Form , it's for setField
    if (value && isUpdating.current) {
      if (!isSearching.current) {
        setOptions([value]);
      }
      setCurrentValue(value[outputValue] || value); // set nested value or value
      onChange(value[outputValue] || value);
      isUpdating.current = false;
    }
  }, [value]);

  return (
    <Select
      onDropdownVisibleChange={(open) => {
        if (open) {
          onDropDownOpen();
        }
      }}
      loading={isLoading}
      showSearch
      allowClear
      placeholder={'Search Here'}
      defaultActiveFirstOption={false}
      filterOption={false}
      notFoundContent={searching ? '... Searching' : <Empty />}
      value={currentValue}
      onSearch={onSearch}
      onChange={(newValue) => {
        if (onChange) {
          if (newValue) {
            const selectedValue = newValue.hasOwnProperty(outputValue)
              ? newValue[outputValue]
              : newValue;
            onChange(selectedValue);
          } else {
            // Handle the case when newValue is undefined or null
            onChange(null);
          }
        }
      }}
      onClear={() => {
        setOptions([]);
        setCurrentValue(undefined);
        setSearching(false);
        setDropDownData([]);
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
      {/* Render data from dropDownOpen function when the dropdown is open */}
      {dropDownData.map((optionField) => (
        <Select.Option
          key={`dropdown-${optionField[outputValue] || optionField}`}
          value={optionField[outputValue] || optionField}
        >
          {labels(optionField)}
        </Select.Option>
      ))}
    </Select>
  );
}
