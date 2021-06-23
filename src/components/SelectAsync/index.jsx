import React, { useState, useEffect, useRef } from "react";
import { request } from "@/request";
import useFetch from "@/hooks/useFetch";
import { Select } from "antd";

export default function SelectAsync({
  entity,
  displayLabels = ["name"],
  outputValue = "_id",
  value,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectOptions, setOptions] = useState([]);
  const [currentValue, setCurrentValue] = useState(undefined);
  const [isLoadingLabel, setLoadingLabel] = useState("List is Loading");
  const asyncList = () => {
    return request.list(entity);
  };
  const { result, isLoading: fetchIsLoading, isSuccess } = useFetch(asyncList);
  useEffect(() => {
    isSuccess ? setOptions(result) : setOptions([]);
    setIsLoading(fetchIsLoading);
  }, [fetchIsLoading]);
  //   const isLoadingRef = useRef();
  //   useEffect(() => {
  //     isLoading ? setLoadingLabel("List is Loading") : setLoadingLabel("");
  //     isLoadingRef.current.values = isLoadingLabel;
  //     console.log("isLoading :", isLoading, " ", isLoadingLabel);
  //   }, [isLoading]);

  const labels = (optionField) => {
    return displayLabels.map((x) => optionField[x]).join(" ");
  };
  useEffect(() => {
    // this for update Form , it's for setField
    if (value) {
      setCurrentValue(value);
    }
  }, [value]);

  return (
    <Select
      loading={isLoading}
      disabled={isLoading}
      value={currentValue}
      onChange={(newValue) => {
        setCurrentValue(newValue);
      }}
      //   defaultValue={isLoadingLabel}
      //   ref={isLoadingRef}
    >
      {selectOptions.map((optionField) => (
        <Select.Option
          key={optionField[outputValue]}
          value={optionField[outputValue]}
        >
          {labels(optionField)}
        </Select.Option>
      ))}
    </Select>
  );
}
