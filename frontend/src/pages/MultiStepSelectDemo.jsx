import React from "react";
import { Typography, message } from "antd";
import MultiStepSelectAsync from "@/components/MultiStepSelectAsync";

const { Title } = Typography;

const fakeFetch = (prefix = "", count = 8, delay = 400) =>
  new Promise((resolve) => {
    const list = Array.from({ length: count }).map((_, i) => {
      const v = ${prefix}-;
      return { value: v, label: ${prefix} option  };
    });
    setTimeout(() => resolve(list), delay);
  });

const Demo = () => {
  const steps = [
    {
      key: "country",
      title: "Country",
      placeholder: "Search country...",
      description: "Choose a country to scope the next selects",
      loadOptions: (search) => fakeFetch(search || "Country", 10, 300),
    },
    {
      key: "state",
      title: "State / Region",
      placeholder: "Search state...",
      description: "Select a state or region (options are async)",
      loadOptions: (search) => fakeFetch(search || "State", 8, 250),
    },
    {
      key: "city",
      title: "City",
      placeholder: "Search city...",
      description: "Pick a city",
      loadOptions: (search) => fakeFetch(search || "City", 10, 200),
    },
  ];

  const onFinish = (result) => {
    message.success(Selected: );
    console.log("Multi-step result:", result);
  };

  return (
    <div style={{ padding: 30 }}>
      <Title level={3}>Multi Step Select (Async) — Demo</Title>
      <MultiStepSelectAsync steps={steps} onFinish={onFinish} />
    </div>
  );
};

export default Demo;
