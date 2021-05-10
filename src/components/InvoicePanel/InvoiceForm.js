import React, { useState, useEffect, useRef } from "react";
import { Form, Input, InputNumber, Button, Select, Divider, Space } from "antd";
import { DatePicker } from "@/components/Antd";
import { Row, Col } from "antd";
import SearchBox from "@/components/SearchBox";
import { PlusOutlined } from "@ant-design/icons";
import ItemRow from "./ItemRow";

export default function InvoiceForm() {
  const { Option } = Select;

  return (
    <>
      <Row gutter={[12, 0]}>
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
            label="Invoice Number"
            name="number"
            rules={[
              {
                required: false,
                message: "Please input your number name!",
              },
            ]}
          >
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item
            label="recurring"
            name="recurring"
            rules={[
              {
                required: false,
                message: "Please input your currency!",
              },
            ]}
          >
            <Select>
              <Option value="null">No</Option>
              <Option value="1-month">Every Month</Option>
              <Option value="6-month">Every 6 Months</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={5}>
          <Form.Item
            label="currency"
            name="currency"
            rules={[
              {
                required: false,
                message: "Please input your currency!",
              },
            ]}
          >
            <Select>
              <Option value="Dollar">Dollar</Option>
              <Option value="Euro">Euro</Option>
              <Option value="Dinar">Dinar Algerian</Option>
            </Select>
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={9}>
          <Form.Item
            label="Invoice Note"
            name="note"
            rules={[
              {
                required: false,
                message: "Please input your number name!",
              },
            ]}
          >
            <Input />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={8}>
          <Form.Item
            label="Invoice Date"
            name="date"
            rules={[
              {
                required: false,
                message: "Please input your number name!",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format={"DD/MM/YYYY"} />
          </Form.Item>
        </Col>
        <Col className="gutter-row" span={7}>
          <Form.Item
            label="Invoice Expire Date"
            name="expiredDate"
            rules={[
              {
                required: false,
                message: "Please input your number name!",
              },
            ]}
          >
            <DatePicker style={{ width: "100%" }} format={"DD/MM/YYYY"} />
          </Form.Item>
        </Col>
      </Row>
      <Divider dashed />
      <Space></Space>
      <Form.List name="itemsList">
        {(fields, { add, remove }) => (
          <>
            {fields.map(({ key, name, fieldKey, ...restField }) => (
              <ItemRow
                key={key}
                name={name}
                fieldKey={fieldKey}
                remove={remove}
                restField={restField}
              ></ItemRow>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
              >
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
    </>
  );
}
