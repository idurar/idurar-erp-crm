import { Empty, Select, Tag } from 'antd';
import React, { useState } from 'react';
import { currencies } from './currenciesList';

const SelectCurrency = () => {
  const [selectCurrencies, setSelectCurrencies] = useState(currencies);
  const [currentValue, setCurrentValue] = useState(null);

  function onSearch(term) {
    if (term && term.trim() !== '') {
      setSelectCurrencies([
        ...currencies.filter(
          (curr) => curr.code.toLowerCase().includes(term) || curr.name.toLowerCase().includes(term)
        ),
      ]);
    }
    console.log(selectCurrencies);
  }

  function onSelect(val) {
    console.log(val);
    setCurrentValue(val);
  }

  return (
    <Select
      showSearch
      defaultActiveFirstOption={true}
      showArrow={true}
      filterOption={true}
      notFoundContent={selectCurrencies.length ? '... Searching' : <Empty />}
      value={currentValue}
      onSearch={onSearch}
      onSelect={onSelect}
    >
      {selectCurrencies?.map((curr) => (
        <Select.Option key={curr.code} value={curr.code}>
          <Tag size="small">{curr.code}</Tag>
          <span>{curr.name}</span>
        </Select.Option>
      ))}
    </Select>
  );
};

export default SelectCurrency;
