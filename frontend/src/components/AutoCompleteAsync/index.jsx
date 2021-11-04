import React, { useState, useEffect, useRef } from "react";
import { request } from "@/request";
import useOnFetch from "@/hooks/useOnFetch";
import { Select, Empty } from "antd";

export default function AutoCompleteAsync({
  entity,
  displayLabels,
  searchFields,
  outputValue = "_id",
  value, /// this is for update
  onChange, /// this is for update
}) {
  const [selectOptions, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(undefined);

  const isUpdating = useRef(true);
  const isSearching = useRef(false);

  let source = request.source();

  const asyncSearch = (options) => {
    return request.search(entity, source, options);
  };

  let { onFetch, result, isSuccess, isLoading } = useOnFetch();

  const labels = (optionField) => {
    return displayLabels.map((x) => optionField[x]).join(" ");
  };

  const onSearch = (searchText) => {
    if (searchText) {
      setOptions([]);
      setCurrentValue(undefined);
      isSearching.current = true;
      source.cancel();
      source = request.source();
      const options = {
        q: searchText,
        fields: searchFields,
      };
      onFetch(() => asyncSearch(options));
    }
  };

  useEffect(() => {
    if (isSuccess) {
      setOptions(result);
    } else {
      setCurrentValue(undefined);
      setOptions([]);
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
      loading={isLoading}
      showSearch
      placeholder={"Search Here"}
      defaultActiveFirstOption={false}
      showArrow={false}
      filterOption={false}
      notFoundContent={isLoading ? "... Searching" : <Empty />}
      value={currentValue}
      onSearch={onSearch}
      onChange={(newValue) => {
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
