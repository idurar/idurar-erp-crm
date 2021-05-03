import React, { useEffect, useRef, useState } from "react";

import { useSelector } from "react-redux";

import { useUiContext } from "@/context/ui";
import { selectCurrentItem } from "@/redux/crud/selectors";
import { valueByString } from "@/utils/helpers";

export default function Read({ readColumns }) {
  const { result: currentResult } = useSelector(selectCurrentItem);
  const { state } = useUiContext();
  const { isReadBoxOpen } = state;
  const [listState, setListState] = useState([]);

  const isFirstRun = useRef(true);
  useEffect(() => {
    if (isFirstRun.current) {
      isFirstRun.current = false;
      return;
    }
    const list = [];
    readColumns.map((props) => {
      const propsKey = props.dataIndex;
      const propsTitle = props.title;
      const value = valueByString(currentResult, propsKey);
      list.push({ propsKey, label: propsTitle, value: value });
    });
    setListState(list);
  }, [currentResult]);

  const show = isReadBoxOpen
    ? { display: "block", opacity: 1 }
    : { display: "none", opacity: 0 };

  const itemsList = listState.map((item) => {
    return (
      <div key={item.propsKey}>
        <p>{item.label}</p>
        <p> : </p>
        <p>{item.value}</p>
      </div>
    );
  });

  return (
    <div style={show}>
      <p>This show content area</p>
      {itemsList}
    </div>
  );
}
