import { Empty, Select } from 'antd';
import { useEffect, useRef, useState } from 'react';

import { request } from '@/request';
import useDebounce from '@/hooks/useDebounce';
import useLanguage from '@/locale/useLanguage';
import { useNavigate } from 'react-router-dom';
import useOnFetch from '@/hooks/useOnFetch';

export default function AutoCompleteAsync({
  entity,
  displayLabels,
  searchFields,
  outputValue = '_id',
  redirectLabel = 'Add New',
  withRedirect = false,
  urlToRedirect = '/',
  value, /// this is for update
  onChange, /// this is for update
}) {
  const translate = useLanguage();

  const addNewValue = { value: 'redirectURL', label: `+ ${translate(redirectLabel)}` };

  const [selectOptions, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(undefined);

  const isUpdating = useRef(true);
  const isSearching = useRef(false);

  const [searching, setSearching] = useState(false);

  const [valToSearch, setValToSearch] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  const navigate = useNavigate();

  const handleSelectChange = (newValue) => {
    alert('Testing Alert');
    isUpdating.current = false;
    // setCurrentValue(value[outputValue] || value); // set nested value or value
    // onChange(newValue[outputValue] || newValue);
    if (onChange) {
      if (newValue) onChange(newValue[outputValue] || newValue);
    }
    if (newValue === 'redirectURL' && withRedirect) {
      navigate(urlToRedirect);
    }
  };

  const handleOnSelect = (value) => {
    setCurrentValue(value[outputValue] || value); // set nested value or value
  };

  const [, cancel] = useDebounce(
    () => {
      //  setState("Typing stopped");
      setDebouncedValue(valToSearch);
    },
    500,
    [valToSearch]
  );

  const asyncSearch = async (options) => {
    return await request.search({ entity, options });
  };

  let { onFetch, result, isSuccess, isLoading } = useOnFetch();

  const labels = (optionField) => {
    return displayLabels.map((x) => optionField[x]).join(' ');
  };

  useEffect(() => {
    const options = {
      q: debouncedValue,
      fields: searchFields,
    };
    const callback = asyncSearch(options);
    onFetch(callback);

    return () => {
      cancel();
    };
  }, [debouncedValue]);

  const onSearch = (searchText) => {
    alert('onSearch');
    isSearching.current = true;
    setSearching(true);
    // setOptions([]);
    // setCurrentValue(undefined);
    setValToSearch(searchText);
  };

  useEffect(() => {
    if (isSuccess) {
      setOptions(result);
    } else {
      setSearching(false);
      // setCurrentValue(undefined);
      // setOptions([]);
    }
  }, [isSuccess, result]);
  useEffect(() => {
    // this for update Form , it's for setField
    if (value && isUpdating.current) {
      alert('isUpdating');

      setOptions([value]);
      setCurrentValue(value[outputValue] || value); // set nested value or value
      onChange(value[outputValue] || value);
      isUpdating.current = false;
    }
  }, [value]);

  return (
    <div>
      <Select
        loading={isLoading}
        showSearch
        allowClear
        placeholder={translate('Search')}
        defaultActiveFirstOption={false}
        filterOption={false}
        notFoundContent={searching ? '... Searching' : <Empty />}
        value={currentValue}
        onSearch={onSearch}
        onClear={() => {
          // setOptions([]);
          // setCurrentValue(undefined);
          setSearching(false);
        }}
        onChange={handleSelectChange}
        style={{ minWidth: '220px' }}
        // onSelect={handleOnSelect}
      >
        {selectOptions.map((optionField) => (
          <Select.Option
            key={optionField[outputValue] || optionField}
            value={optionField[outputValue] || optionField}
          >
            {labels(optionField)}
          </Select.Option>
        ))}
        {withRedirect && (
          <Select.Option value={addNewValue.value}>{addNewValue.label}</Select.Option>
        )}
      </Select>
    </div>
  );
}
