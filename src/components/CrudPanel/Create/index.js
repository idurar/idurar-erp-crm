import React from "react";

import { useDispatch } from "react-redux";
import { createAction } from "@/redux/crud/actions";
import { useUiContext } from "@/context/ui";

import { Button, Form } from "antd";

export default function Create({ entity, formElements }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const onSubmit = (values) => {
    console.log("fieldsValues", values);
    dispatch(createAction(entity, values));
  };

  return (
    <>
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        {formElements}
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
