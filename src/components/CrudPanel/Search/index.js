import React, { useEffect, useState } from "react";
import { AutoComplete } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { request } from "@/request";
import { useUiContext } from "@/context/ui";
import { selectSearchedItems } from "@/redux/crud/selectors";

import { Button, Form } from "antd";
import Loading from "@/components/Loading";

export default function Search({ entity }) {
  const mockVal = (str, repeat = 1) => ({
    value: str.repeat(repeat),
  });

  const dispatch = useDispatch();

  const [value, setValue] = useState("");
  const [close, setClose] = useState(false);
  const [options, setOptions] = useState([]);
  let source = request.source();
  const { result, isLoading, isSuccess } = useSelector(selectSearchedItems);
  let optionResults = [];
  const onSearch = (searchText) => {
    dispatch(crud.search(entity, source, { question: searchText }));
  };

  const onSelect = (data) => {
    console.log("onSelect", data);
  };

  const onChange = (data) => {
    const currentItem = options.find((item) => {
      return item.value === data;
    });
    const currentValue = currentItem ? currentItem.label : data;
    setValue(currentValue);
  };
  const onClose = () => {
    setClose(true);
  };
  useEffect(() => {
    optionResults = [];
    console.log("useEffect", result);
    result.map((item) =>
      optionResults.push({ label: item.name, value: item._id })
    );
    console.log("useEffect", optionResults);
    setOptions(optionResults);
  }, [result]);

  return (
    <AutoComplete
      value={value}
      options={options}
      style={{
        width: 200,
      }}
      onSelect={onSelect}
      onSearch={onSearch}
      onChange={onChange}
      onBlur={onClose}
      allowClear={true}
      placeholder="control mode"
    />
  );
}
