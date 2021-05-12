import React, { useEffect, useState, useRef } from "react";

import { AutoComplete } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { search } from "@/redux/search/actions";
import { request } from "@/request";

import { searchState } from "@/redux/search/selectors";

export const useSearchBox = (keyRef) => {
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

export default function SearchBox({
  entity,
  keyRef,
  displayLabels,
  searchFields,
  outputField = "_id",
  value = "",
  onChange, /// this form item handel
}) {
  const dispatch = useDispatch();
  const [fieldValue, setValue] = useState(value);

  const [options, setOptions] = useState([]);

  let source = request.source();

  let { result, isLoading, isSuccess } = useSearchBox(keyRef);
  const isTyping = useRef(false);

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
    const currentItem = result.find((item) => {
      return item[outputField] === data;
    });
    dispatch(search.selected(keyRef, currentItem));
  };

  const handelChange = (data) => {
    const currentItem = options.find((item) => {
      return item.value === data;
    });
    const currentValue = currentItem ? currentItem.label : data;
    if (onChange) {
      onChange(data);
    }
    setValue(currentValue);
  };

  useEffect(() => {
    let optionResults = [];
    result.map((item) => {
      const labels = displayLabels.map((x) => item[x]).join(" ");
      optionResults.push({ label: labels, value: item[outputField] });
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
