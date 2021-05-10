import React, { useEffect } from "react";
import { Form, Divider } from "antd";

import Loading from "@/components/Loading";
import SearchBox from "@/components/SearchBox";

import { Button, PageHeader, Row, Col, Statistic, Tag } from "antd";

import { useSelector, useDispatch } from "react-redux";
import { crud } from "@/redux/crud/actions";
import { selectListItems, selectItemById } from "@/redux/crud/selectors";
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

  useEffect(() => {}, []);
  const [form] = Form.useForm();

  const onSubmit = (fieldsValue) => {
    console.log("fieldsValue", fieldsValue);
    let values = {};
    if (fieldsValue) {
      if (fieldsValue.birthday) {
        values = {
          ...fieldsValue,
          birthday: fieldsValue["birthday"].format("DD/MM/YYYY"),
        };
      }
      if (fieldsValue.date) {
        values = {
          ...fieldsValue,
          birthday: fieldsValue["date"].format("DD/MM/YYYY"),
        };
      }
    }
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
      <Form form={form} layout="vertical" onFinish={onSubmit}>
        <InvoiceForm />
        <Form.Item>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    </>
  );
}
