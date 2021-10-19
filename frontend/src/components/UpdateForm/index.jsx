import React, { useEffect } from "react";
import dayjs from "dayjs";

import { useDispatch, useSelector } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { useCrudContext } from "@/context/crud";
import { selectUpdatedItem } from "@/redux/crud/selectors";

import { selectCurrentItem } from "@/redux/crud/selectors";

import { Button, Form } from "antd";
import Loading from "@/components/Loading";

export default function UpdateForm({ config, formElements }) {
  let { entity } = config;
  const dispatch = useDispatch();
  const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);

  const { state, crudContextAction } = useCrudContext();

  /////

  const { panel, collapsedBox, readBox } = crudContextAction;

  const showCurrentRecord = () => {
    readBox.open();
  };

  /////
  const [form] = Form.useForm();

  const onSubmit = (fieldsValue) => {
    const id = current._id;
    dispatch(crud.update(entity, id, fieldsValue));
  };
  useEffect(() => {
    if (current) {
      let obj = {};
      for (const key in current) {
        obj[key] = dayjs(current[key], "YYYY-MM-DD").isValid()
          ? dayjs(current[key])
          : current[key];
      }
      form.setFieldsValue(obj);
    }
  }, [current]);

  useEffect(() => {
    if (isSuccess) {
      readBox.open();
      collapsedBox.open();
      panel.open();
      form.resetFields();
      dispatch(crud.resetAction("update"));
      dispatch(crud.list(entity));
    }
  }, [isSuccess]);

  const { isEditBoxOpen } = state;

  const show = isEditBoxOpen
    ? { display: "block", opacity: 1 }
    : { display: "none", opacity: 0 };
  return (
    <div style={show}>
      <Loading isLoading={isLoading}>
        <Form form={form} layout="vertical" onFinish={onSubmit}>
          {formElements}
          <Form.Item
            style={{
              display: "inline-block",
              paddingRight: "5px",
            }}
          >
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
          <Form.Item
            style={{
              display: "inline-block",
              paddingLeft: "5px",
            }}
          >
            <Button onClick={showCurrentRecord}>Cancel</Button>
          </Form.Item>
        </Form>
      </Loading>
    </div>
  );
}
