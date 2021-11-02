import React from "react";
import dayjs from "dayjs";
import { Form, Input, InputNumber } from "antd";
import { DatePicker } from "@/components/CustomAntd";
import SelectAsync from "@/components/SelectAsync";

export default function PaymentForm({
  maxAmount = null,
  isUpdateForm = false,
}) {
  const { TextArea } = Input;
  return (
    <>
      <Form.Item
        label="Number"
        name="number"
        initialValue={1}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <InputNumber style={{ width: "50%" }} />
      </Form.Item>
      <Form.Item
        name="date"
        label="Date"
        rules={[
          {
            required: true,
            type: "object",
          },
        ]}
        initialValue={dayjs().add(30, "days")}
      >
        <DatePicker style={{ width: "50%" }} format={"DD/MM/YYYY"} />
      </Form.Item>
      <Form.Item
        label="Amount"
        name="amount"
        rules={[{ required: true, message: "Amount is required" }]}
      >
        <InputNumber
          style={{ width: "100%" }}
          min={0}
          max={maxAmount}
          formatter={(value) =>
            `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
          }
        />
      </Form.Item>
      <Form.Item
        label="Payment Mode"
        name="paymentMode"
        rules={[
          {
            required: true,
          },
        ]}
      >
        <SelectAsync
          entity={"paymentMode"}
          displayLabels={["name"]}
        ></SelectAsync>
      </Form.Item>
      <Form.Item label="Reference" name="ref">
        <Input />
      </Form.Item>
      <Form.Item label="Description" name="description">
        <TextArea />
      </Form.Item>
    </>
  );
}
