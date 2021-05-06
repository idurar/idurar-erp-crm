import React, { useEffect, useState, useRef } from "react";

import { AutoComplete, Input } from "antd";
import { SearchOutlined } from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { request } from "@/request";
import { useUiContext } from "@/context/ui";
import { selectSearchedItems } from "@/redux/crud/selectors";

import { Empty } from "antd";

export default function Search({ entity, config, searchConfig }) {
  console.log("render search component");
  const { displayLabels, searchFields } = config.searchConfig;
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const [options, setOptions] = useState([]);

  const { uiContextAction } = useUiContext();
  const { panel, collapsedBox, readBox } = uiContextAction;

  let source = request.source();
  const { result, isLoading, isSuccess } = useSelector(selectSearchedItems);

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
          crud.search(entity, source, {
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

    dispatch(crud.currentItem(currentItem));
    panel.open();
    collapsedBox.open();
    readBox.open();
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
      notFoundContent={!isSuccess ? <Empty /> : ""}
      allowClear={true}
      placeholder="control mode"
    >
      <Input suffix={<SearchOutlined />} />
    </AutoComplete>
  );
}
