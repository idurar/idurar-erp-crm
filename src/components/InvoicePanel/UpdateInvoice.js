import React, { useState, useEffect } from "react";
import { Form, Divider } from "antd";
import dayjs from "dayjs";
import { Button, PageHeader, Row, Statistic, Tag } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { invoice } from "@/redux/invoice/actions";

import { useInvoiceContext } from "@/context/invoice";
import uniqueId from "@/utils/uniqueId";
import { selectUpdatedItem } from "@/redux/invoice/selectors";
import Loading from "@/components/Loading";
import InvoiceForm from "./InvoiceForm";

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

export default function UpdateInvoice({ config }) {
  let { entity } = config;
  const { invoiceContextAction } = useInvoiceContext();
  const { updatePanel } = invoiceContextAction;
  const dispatch = useDispatch();
  const { current, isLoading, isSuccess } = useSelector(selectUpdatedItem);
  const [form] = Form.useForm();
  const [subTotal, setSubTotal] = useState(0);
  const [autoCompleteValue, setAutoCompleteValue] = useState("");

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
        fieldsValue = {
          ...fieldsValue,
          expiredDate: fieldsValue["expiredDate"].format("DD/MM/YYYY"),
        };
      }
      if (fieldsValue.date) {
        fieldsValue = {
          ...fieldsValue,
          date: fieldsValue["date"].format("DD/MM/YYYY"),
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

    const id = current._id;

    dispatch(invoice.update(entity, id, fieldsValue));
  };
  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
      setSubTotal(0);
      dispatch(invoice.resetAction("update"));
      updatePanel.close();
    }
  }, [isSuccess]);

  useEffect(() => {
    if (current) {
      if (current.client) {
        const tmpValue = { ...current.client };
        setAutoCompleteValue(tmpValue);

        current.client = undefined;
      }
      if (current.date) {
        current.date = dayjs(current.date, "DD/MM/YYYY");
      }
      if (current.expiredDate) {
        current.expiredDate = dayjs(current.expiredDate, "DD/MM/YYYY");
      }
      if (!current.taxRate) {
        current.taxRate = 0;
      }

      const { subTotal } = current;

      form.setFieldsValue(current);
      setSubTotal(subTotal);
    }
  }, [current]);

  return (
    <>
      <PageHeader
        onBack={() => updatePanel.close()}
        title="Update Invoice"
        ghost={false}
        tags={<Tag color="volcano">Draft</Tag>}
        subTitle="This is update page"
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
          <InvoiceForm
            subTotal={subTotal}
            autoCompleteUpdate={autoCompleteValue}
            current={current}
          />
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
