import React, { useEffect, useState, useRef } from "react";
import { AutoComplete } from "antd";
import { useSelector, useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { request } from "@/request";
import { useUiContext } from "@/context/ui";
import { selectSearchedItems } from "@/redux/crud/selectors";

import { Empty } from "antd";

export default function Search({ entity, searchConfig }) {
  const { displayLabels, searchFields } = searchConfig;
  const dispatch = useDispatch();
  const [value, setValue] = useState("");
  const [openStatus, setOpenStatus] = useState(false);
  const [options, setOptions] = useState([]);

  const { uiContextAction } = useUiContext();
  const { panel, collapsedBox, readBox } = uiContextAction;

  let source = request.source();
  const { result, isLoading, isSuccess } = useSelector(selectSearchedItems);
  let optionResults = [];

  const isTyping = useRef(false);
  const isSearching = useRef(false);
  let delayTimer = null;
  useEffect(() => {
    if (isLoading) {
      setOptions([{ label: "... Searching" }]);
    }
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
    }, 1000);
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
  const onClose = () => {
    setOpenStatus(false);
    // setOptions([]);
  };
  useEffect(() => {
    optionResults = [];

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
        width: 200,
      }}
      onSelect={onSelect}
      onSearch={onSearch}
      onChange={onChange}
      // onBlur={onClose}
      // open={openStatus}
      // backfill={true}
      notFoundContent={!isSuccess ? <Empty /> : ""}
      allowClear={true}
      placeholder="control mode"
    />
  );
}
