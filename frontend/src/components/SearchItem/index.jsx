import React, { useState, useEffect, useRef } from 'react';

import { useDebounce } from 'react-use';
import { Select, Empty } from 'antd';

import { SearchOutlined } from '@ant-design/icons';
import { useSelector, useDispatch } from 'react-redux';
import { crud } from '@/redux/crud/actions';

import { useCrudContext } from '@/context/crud';
import { selectSearchedItems } from '@/redux/crud/selectors';

function SearchItemComponent({ config, onRerender }) {
  let { entity, searchConfig } = config;

  const { displayLabels, searchFields, outputValue = '_id' } = searchConfig;

  const dispatch = useDispatch();
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, readBox } = crudContextAction;
  const { result, isLoading, isSuccess } = useSelector(selectSearchedItems);

  const [selectOptions, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(undefined);

  const isSearching = useRef(false);

  const [searching, setSearching] = useState(false);

  const [valToSearch, setValToSearch] = useState('');
  const [debouncedValue, setDebouncedValue] = useState('');

  const [, cancel] = useDebounce(
    () => {
      setDebouncedValue(valToSearch);
    },
    500,
    [valToSearch]
  );

  const labels = (optionField) => {
    return displayLabels.map((x) => optionField[x]).join(' ');
  };

  useEffect(() => {
    if (debouncedValue != '') {
      const options = {
        q: debouncedValue,
        fields: searchFields,
      };
      dispatch(crud.search({ entity, options }));
    }
    return () => {
      cancel();
    };
  }, [debouncedValue]);

  const onSearch = (searchText) => {
    if (searchText && searchText != '') {
      isSearching.current = true;
      setSearching(true);
      setOptions([]);
      setCurrentValue(undefined);
      setValToSearch(searchText);
    }
  };

  const onSelect = (data) => {
    const currentItem = result.find((item) => {
      return item[outputValue] === data;
    });

    dispatch(crud.currentItem({ data: currentItem }));

    panel.open();
    collapsedBox.open();
    readBox.open();
    onRerender();
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

  return (
    <Select
      loading={isLoading}
      showSearch
      allowClear
      placeholder={<SearchOutlined style={{ float: 'right', padding: '8px 0' }} />}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      notFoundContent={searching ? '... Searching' : <Empty />}
      value={currentValue}
      onSearch={onSearch}
      style={{ width: '100%' }}
      onSelect={onSelect}
    >
      {selectOptions.map((optionField) => (
        <Select.Option key={optionField[outputValue]} value={optionField[outputValue]}>
          {labels(optionField)}
        </Select.Option>
      ))}
    </Select>
  );
}

export default function SearchItem({ config }) {
  const [state, setState] = useState([0]);

  const onRerender = () => {
    setState([state + 1]);
  };

  return state.map((comp) => (
    <SearchItemComponent key={comp} config={config} onRerender={onRerender} />
  ));
}
