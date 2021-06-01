import React, { useState, useEffect } from "react";
import { request } from "@/request";
import useFetch from "@/hooks/useFetch";
import { Select } from "antd";

export default function SelectAsync({
  entity,
  displayLabels = ["displayName"],
  outputValue = "_id",
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [selectOptions, setOptions] = useState([]);
  const asyncList = () => {
    return request.list(entity);
  };
  const { result, isLoading: fetchIsLoading, isSuccess } = useFetch(asyncList);
  useEffect(() => {
    isSuccess ? setOptions(result) : setOptions([]);
    setIsLoading(fetchIsLoading);
  }, [fetchIsLoading]);
  const labels = (optionField) => {
    return displayLabels.map((x) => optionField[x]).join(" ");
  };
  return (
    <Select loading={isLoading}>
      {isLoading && (
        <Select.Option value="undefined">"List is Loading"</Select.Option>
      )}
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
