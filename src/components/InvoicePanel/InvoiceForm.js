import React from "react";
import { Form, Input, Button, Radio, Select, Switch } from "antd";
import { DatePicker, TimePicker, Calendar } from "@/components/Antd";
import { Row, Col } from "antd";
import SearchBox from "@/components/SearchBox";

export default function InvoiceForm() {
  return (
    <Row gutter={[12, 24]}>
      <Col className="gutter-row" span={9}>
        <Form.Item
          name="client"
          label="Client"
          rules={[
            {
              required: true,
              message: "Please input your client!",
            },
          ]}
        >
          <SearchBox
            entity={"client"}
            keyRef={"client"}
            displayLabels={["company"]}
            searchFields={"company,managerSurname,managerName"}
          />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={5}>
        <Form.Item
          label="company Name"
          name="company"
          rules={[
            {
              required: true,
              message: "Please input your company name!",
            },
          ]}
        >
          <Input />
        </Form.Item>
      </Col>
      <Col className="gutter-row" span={5}></Col>
      <Col className="gutter-row" span={5}></Col>
      <Col className="gutter-row" span={9}></Col>
      <Col className="gutter-row" span={5}></Col>
      <Col className="gutter-row" span={5}></Col>
      <Col className="gutter-row" span={5}></Col>
    </Row>
  );
}
