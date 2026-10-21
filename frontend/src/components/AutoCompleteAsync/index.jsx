import { useState, useEffect, useRef } from 'react';

import { request } from '@/request';
import useOnFetch from '@/hooks/useOnFetch';
import useDebounce from '@/hooks/useDebounce';
import { useNavigate } from 'react-router-dom';

import { Select, Empty } from 'antd';
import useLanguage from '@/locale/useLanguage';

const EMPTY_SEARCH_OPTIONS = Object.freeze({});

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
  placeholder,
  searchOptions = EMPTY_SEARCH_OPTIONS,
  optionLabel,
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
    isUpdating.current = false;
    // setCurrentValue(value[outputValue] || value); // set nested value or value
    // onChange(newValue[outputValue] || newValue);
    if (onChange) onChange(newValue?.[outputValue] || newValue);
    if (!newValue) setCurrentValue(undefined);
    if (newValue === 'redirectURL' && withRedirect) {
      navigate(urlToRedirect);
    }
  };

  const [, cancel] = useDebounce(
    () => {
      //  setState("Typing stopped");
      setDebouncedValue(valToSearch);
    },
    500,
    valToSearch
  );

  let { onFetch, result, isSuccess, isLoading } = useOnFetch();

  const labels = (optionField) => {
    if (optionLabel) return optionLabel(optionField);
    return displayLabels.map((x) => optionField[x]).join(' ');
  };

  useEffect(() => {
    const options = {
      ...searchOptions,
      q: debouncedValue,
      fields: searchFields,
    };
    const callback = request.search({ entity, options });
    onFetch(callback);

    return () => {
      cancel();
    };
  }, [cancel, debouncedValue, entity, onFetch, searchFields, searchOptions]);

  const onSearch = (searchText) => {
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
      setOptions([value]);
      setCurrentValue(value[outputValue] || value); // set nested value or value
      onChange(value[outputValue] || value);
      isUpdating.current = false;
    }
  }, [onChange, outputValue, value]);

  return (
    <Select
      loading={isLoading}
      showSearch
      allowClear
      placeholder={placeholder || translate('Search')}
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
      {withRedirect && <Select.Option value={addNewValue.value}>{addNewValue.label}</Select.Option>}
    </Select>
  );
}
