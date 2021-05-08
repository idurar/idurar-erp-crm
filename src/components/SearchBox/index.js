import React, { useEffect, useState, useRef } from "react";

import { AutoComplete } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { search } from "@/redux/search/actions";
import { request } from "@/request";

import { selectSearch, searchState } from "@/redux/search/selectors";

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
}) {
  console.log("render search component");

  const dispatch = useDispatch();
  const [value, setValue] = useState("");

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
      return item._id === data;
    });
    dispatch(search.selected(keyRef, currentItem));
  };

  const onChange = (data) => {
    const currentItem = options.find((item) => {
      return item.value === data;
    });
    const currentValue = currentItem ? currentItem.label : data;
    setValue(currentValue);
  };

  useEffect(() => {
    let optionResults = [];
    result.map((item) => {
      const labels = displayLabels.map((x) => item[x]).join(" ");
      optionResults.push({ label: labels, value: item._id });
    });

    setOptions(optionResults);
  }, [result]);

  return (
    <AutoComplete
      value={value}
      options={options}
      style={{
        width: "100%",
      }}
      onSelect={onSelect}
      onSearch={onSearch}
      onChange={onChange}
      //   notFoundContent={!isSuccess ? <Empty /> : ""}
      allowClear={true}
      placeholder="Start Searching here"
    ></AutoComplete>
  );
}
