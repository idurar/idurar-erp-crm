import React, { useEffect, useState, useRef } from "react";

import { AutoComplete } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { search } from "@/redux/search/actions";
import { request } from "@/request";

import { searchState } from "@/redux/search/selectors";

export const useAutoComplete = (keyRef) => {
  let state = useSelector(searchState);
  let [currentState, setCurrentState] = useState({
    result: [],
    selected: null,
    isLoading: false,
    isSuccess: false,
  });
  useEffect(() => {
    let newState = state[keyRef];
    if (newState) setCurrentState(newState);
  }, [state]);
  return currentState;
};

export default function AutoCompleteAsync({
  entity,
  keyRef,
  displayLabels,
  searchFields,
  outputValue = "_id",
  value: formItemValue, /// this is for update
  onChange, /// this is for update
}) {
  const dispatch = useDispatch();
  const [fieldValue, setValue] = useState(formItemValue);

  const [options, setOptions] = useState([]);

  let source = request.source();

  let { result, isLoading, isSuccess } = useAutoComplete(keyRef);
  const isTyping = useRef(false);
  const isSelect = useRef(false);

  let delayTimer = null;
  useEffect(() => {
    isLoading && setOptions([{ label: "... Searching" }]);
  }, [isLoading]);
  const onSearch = (searchText) => {
    isTyping.current = true;

    clearTimeout(delayTimer);
    delayTimer = setTimeout(function () {
      if (isTyping.current && searchText !== "") {
        dispatch(
          search.list(entity, keyRef, source, {
            question: searchText,
            fields: searchFields,
          })
        );
      }
      isTyping.current = false;
    }, 500);
  };

  const onSelect = (data) => {
    isSelect.current = true;
    const currentItem = result.find((item) => {
      return item[outputValue] === data;
    });
    dispatch(search.selected(keyRef, currentItem));
  };

  const handelChange = (data) => {
    const currentItem = options.find((item) => {
      return item.value === data;
    });

    const currentValue = currentItem ? currentItem.label : data;

    setValue(currentValue);
    if (onChange) {
      onChange(data);
    }
  };
  let optionResults = [];
  const isUpdating = useRef(true);
  useEffect(() => {
    // this for update Form , it's for setField
    if (formItemValue && !isTyping.current && !isSelect.current) {
      isUpdating.current = false;
      // optionResults = [];
      const labels = displayLabels.map((x) => formItemValue[x]).join(" ");
      optionResults.push({ label: labels, value: formItemValue[outputValue] });
      setValue(labels);
      setOptions(optionResults);
      // if (onChange) {
      //   onChange(formItemValue[outputValue]);
      // }
    }
  }, [formItemValue]);

  useEffect(() => {
    // optionResults = [];

    result.map((item) => {
      const labels = displayLabels.map((x) => item[x]).join(" ");
      optionResults.push({ label: labels, value: item[outputValue] });
    });
    setOptions(optionResults);
  }, [result]);

  return (
    <AutoComplete
      value={fieldValue}
      options={options}
      style={{
        width: "100%",
      }}
      onSelect={onSelect}
      onSearch={onSearch}
      onChange={handelChange}
      notFoundContent={!isSuccess ? "No result found" : ""}
      allowClear={true}
      placeholder="Start Searching here"
    ></AutoComplete>
  );
}
