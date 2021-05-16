import React, { useState, useEffect } from "react";
import { Form, Divider } from "antd";

import { Button, PageHeader, Row, Statistic, Tag } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { invoice } from "@/redux/invoice/actions";
import { selectCreatedItem } from "@/redux/invoice/selectors";

import { useInvoiceContext } from "@/context/invoice";
import uniqueId from "@/utils/uniqueId";

import InvoiceForm from "./InvoiceForm";
import Loading from "@/components/Loading";

function SaveForm({ form }) {
  const handelClick = () => {
    form.submit();
  };

  return (
    <Button onClick={handelClick} type="primary">
      Save Invoice
    </Button>
  );
}

export default function CreateInvoice({ config }) {
  let { entity } = config;
  const { invoiceContextAction } = useInvoiceContext();
  const { createPanel } = invoiceContextAction;
  const dispatch = useDispatch();
  const { isLoading, isSuccess } = useSelector(selectCreatedItem);
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

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      dispatch(invoice.resetAction("create"));
      setSubTotal(0);
    }
  }, [isSuccess]);

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
    dispatch(invoice.create(entity, fieldsValue));
  };

  return (
    <>
      <PageHeader
        onBack={() => createPanel.close()}
        title="Create Invoice"
        ghost={false}
        tags={<Tag color="volcano">Draft</Tag>}
        subTitle="This is create page"
        extra={[<SaveForm form={form} key={`${uniqueId()}`} />]}
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
      <Loading isLoading={isLoading}>
        <Form
          form={form}
          layout="vertical"
          onFinish={onSubmit}
          onValuesChange={handelValuesChange}
        >
          <InvoiceForm subTotal={subTotal} />
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Loading>
    </>
  );
}
