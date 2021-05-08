import React from "react";

import { useDispatch } from "react-redux";
import { updateAction } from "@/redux/crud/actions";
import { useUiContext } from "@/context/ui";

import { Button, Form } from "antd";

export default function Update({ entity, formElements }) {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const onSubmit = (values) => {
    console.log("fieldsValues", values);
    const id = 1;
    dispatch(updateAction(entity, id, values));
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
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
