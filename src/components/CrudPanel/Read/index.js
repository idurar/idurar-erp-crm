import React, { useEffect, useState } from "react";

import { useSelector } from "react-redux";

import { useUiContext } from "@/context/ui";
import { selectCurrentItem } from "@/redux/crud/selectors";

import { Button, Form } from "antd";
import Loading from "@/components/Loading";

export default function Read({ config }) {
  const { result } = useSelector(selectCurrentItem);
  const { state } = useUiContext();
  const { isReadBoxOpen } = state;
  const [listState, setListState] = useState([]);

  // const data = response.result;
  // const obj = JSON.parse(list);

  // for (let i = 0; i < obj.length; ++i) {
  //   let listItem = document.createElement("li");
  //   const propKey = obj[i].key;
  //   const propText = obj[i].text;
  //   let textItem = document.createElement("p");
  //   let point = document.createElement("p");
  //   let valueItem = document.createElement("p");
  //   textItem.textContent = propText;
  //   point.textContent = ":";
  //   listItem.appendChild(textItem);
  //   listItem.appendChild(point);
  //   valueItem.textContent = valueByString(data, propKey);
  //   listItem.appendChild(valueItem);
  //   divResult.appendChild(listItem);
  // }
  useEffect(() => {
    if (result) {
      const list = Object.entries(result);
      setListState(list);
      console.log(listState);
      // Object.entries(result).forEach(([key, value]) => {
      //   console.log(`${key} : ${value}`);
      // });
    }
  }, [result]);

  const show = isReadBoxOpen
    ? { display: "block", opacity: 1 }
    : { display: "none", opacity: 0 };
  return (
    <div style={show}>
      <p>This show content area</p>
    </div>
  );
}
