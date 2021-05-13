import React, { useState } from "react";
import { Form, Divider } from "antd";

import { Button, PageHeader, Row, Statistic, Tag } from "antd";

import { useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";

import { useUiContext } from "@/context/ui";
import uniqueId from "@/utils/uniqueId";

import InvoiceForm from "./InvoiceForm";

function AddNewItem() {
  const { uiContextAction } = useUiContext();
  const { collapsedBox, panel } = uiContextAction;
  const handelClick = () => {
    panel.open();
    collapsedBox.close();
  };

  return (
    <Button onClick={handelClick} type="primary">
      Add new Customer
    </Button>
  );
}

export default function CreateInvoice({ config }) {
  let { entity } = config;

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState(0);
  const handelValuesChange = (changedValues, values) => {
    const items = values["items"];
    let subTotal = 0;

    if (items) {
      items.map((item) => {
        if (item) {
          if (item.quantity && item.price) {
            let total = item["quantity"] * item["price"];
            //sub total
            subTotal += total;
          }
        }
      });
      setSubTotal(subTotal);
    }
  };

  const onSubmit = (fieldsValue) => {
    if (fieldsValue) {
      if (fieldsValue.expiredDate) {
        const newDate = fieldsValue["expiredDate"].format("DD/MM/YYYY");
        fieldsValue = {
          ...fieldsValue,
          expiredDate: newDate,
        };
      }
      if (fieldsValue.date) {
        const newDate = fieldsValue["date"].format("DD/MM/YYYY");
        fieldsValue = {
          ...fieldsValue,
          date: newDate,
        };
      }
      if (fieldsValue.items) {
        let newList = [...fieldsValue.items];
        newList.map((item) => {
          item.total = item.quantity * item.price;
        });
        fieldsValue = {
          ...fieldsValue,
          items: newList,
        };
      }
    }
    dispatch(crud.create("invoice", fieldsValue));
  };

  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title="Customer Page"
        ghost={false}
        tags={<Tag color="blue">Running</Tag>}
        subTitle="This is customer page"
        extra={[
          <Button key={`${uniqueId()}`}>Refresh</Button>,
          <AddNewItem key={`${uniqueId()}`} />,
        ]}
        style={{
          padding: "20px 0px",
        }}
      >
        <Row>
          <Statistic title="Status" value="Pending" />
          <Statistic
            title="Price"
            prefix="$"
            value={568.08}
            style={{
              margin: "0 32px",
            }}
          />
          <Statistic title="Balance" prefix="$" value={3345.08} />
        </Row>
      </PageHeader>
      <Divider dashed />
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
        onValuesChange={handelValuesChange}
      >
        <InvoiceForm subTotal={subTotal} />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
