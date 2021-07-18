import React, { useEffect, useState } from "react";

import { useDispatch, useSelector } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { useCrudContext } from "@/context/crud";
import { selectUpdatedItem } from "@/redux/crud/selectors";

import { Button, Form, Input } from "antd";
import { LockOutlined } from "@ant-design/icons";
import Loading from "@/components/Loading";
import useForm from "@/hooks/useForm";
import { request } from "@/request";

export default function UpdatePassword({ config }) {
  const dispatch = useDispatch();
  const { current } = useSelector(selectUpdatedItem);

  const { state } = useCrudContext();

  const [form] = Form.useForm();

  const { onSubmit, result, isLoading, isSuccess } = useForm();

  const handelSubmit = (fieldsValue) => {
    const id = current._id;
    const updateFn = () => {
      return request.patch("admin/password-update/" + id, fieldsValue);
    };
    onSubmit(updateFn);
  };

  useEffect(() => {
    if (current) {
      console.log(
        "🚀 ~ file: UpdatePassword.jsx ~ line 42 ~ useEffect ~ current",
        current
      );
    }
  }, [current]);
  useEffect(() => {
    if (isSuccess) {
      console.log(
        "🚀 ~ file: UpdatePassword.jsx ~ line 42 ~ useEffect ~ result",
        result
      );
      console.log(
        "🚀 ~ file: UpdatePassword.jsx ~ line 42 ~ useEffect ~ isSuccess",
        isSuccess
      );
      // readBox.open();
      form.resetFields();
      dispatch(crud.resetAction("update"));
    }
  }, [isSuccess]);

  const { isAdvancedBoxOpen } = state;

  const show = isAdvancedBoxOpen
    ? { display: "block", opacity: 1 }
    : { display: "none", opacity: 0 };

  return (
    <div style={show}>
      <Loading isLoading={isLoading}>
        <h3>Update Password</h3>
        <div className="space"></div>
        <Form form={form} layout="vertical" onFinish={handelSubmit}>
          <Form.Item
            name="password"
            rules={[
              {
                required: true,
                message: "Please input your Password!",
                len: 8,
              },
            ]}
          >
            <Input
              prefix={<LockOutlined className="site-form-item-icon" />}
              type="password"
              autoComplete="off"
            />
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    </div>
  );
}
