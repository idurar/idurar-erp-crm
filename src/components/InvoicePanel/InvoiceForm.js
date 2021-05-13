import React, { useState, useEffect, useRef } from "react";
import { Form, Input, InputNumber, Button, Select, Divider, Space } from "antd";
import { DatePicker } from "@/components/Antd";
import { Row, Col } from "antd";
import SearchBox from "@/components/SearchBox";
import { PlusOutlined } from "@ant-design/icons";
import ItemRow from "./ItemRow";

export default function InvoiceForm({
  subTotal,
  autoCompleteUpdate = null,
  itemsTotal,
  current = null,
}) {
  const { Option } = Select;
  const [total, setTotal] = useState(0);
  const [taxRate, setTaxRate] = useState(0);
  const [taxTotal, setTaxTotal] = useState(0);
  const handelTaxChange = (value) => {
    setTaxRate(value);
  };
  useEffect(() => {
    if (current) {
      const { subTotal = 0, taxRate = 0, total = 0 } = current;
      setTaxRate(taxRate);
    }
  }, [current]);
  useEffect(() => {
    const currentTotal = subTotal * taxRate + subTotal;
    setTaxTotal(subTotal * taxRate);
    setTotal(currentTotal);
  }, [subTotal, taxRate]);

  const addField = useRef(false);
  useEffect(() => {
    addField.current.click();
  }, []);

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
              onUpdateValue={autoCompleteUpdate}
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
            name="date"
            label="Invoice Date"
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
            name="expiredDate"
            label="Invoice Expire Date"
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
      <Row gutter={[12, 12]} style={{ position: "relative" }}>
        <Col className="gutter-row" span={6}>
          <p>Item</p>
        </Col>
        <Col className="gutter-row" span={8}>
          <p>Description</p>
        </Col>
        <Col className="gutter-row" span={3}>
          <p>Quantity</p>
        </Col>
        <Col className="gutter-row" span={3}>
          <p>Price</p>
        </Col>
        <Col className="gutter-row" span={4}>
          <p>Total</p>
        </Col>
      </Row>
      <Form.List name="items">
        {(fields, { add, remove }) => (
          <>
            {fields.map((field) => (
              <ItemRow
                key={field.key}
                remove={remove}
                field={field}
                itemsTotal={itemsTotal}
                current={current}
              ></ItemRow>
            ))}
            <Form.Item>
              <Button
                type="dashed"
                onClick={() => add()}
                block
                icon={<PlusOutlined />}
                ref={addField}
              >
                Add field
              </Button>
            </Form.Item>
          </>
        )}
      </Form.List>
      <Divider dashed />
      <div style={{ width: "300px", float: "right" }}>
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={10}>
            <p
              style={{
                paddingLeft: "12px",
                paddingTop: "5px",
              }}
            >
              Sub Total :
            </p>
          </Col>

          <Col className="gutter-row" span={14}>
            <Form.Item>
              <InputNumber
                readOnly
                style={{ width: "100%" }}
                value={subTotal}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={10}>
            <Form.Item
              name="taxRate"
              rules={[
                {
                  required: false,
                  message: "Please input your taxRate!",
                },
              ]}
              initialValue="0"
            >
              <Select
                value={taxRate}
                onChange={handelTaxChange}
                bordered={false}
                options={[
                  { value: 0, label: "Tax 0 %" },
                  { value: 0.19, label: "Tax 19 %" },
                ]}
              ></Select>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={14}>
            <Form.Item>
              <InputNumber
                readOnly
                style={{ width: "100%" }}
                value={taxTotal}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }
              />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={10}>
            <p
              style={{
                paddingLeft: "12px",
                paddingTop: "5px",
              }}
            >
              Total :
            </p>
          </Col>
          <Col className="gutter-row" span={14}>
            <Form.Item>
              <InputNumber
                readOnly
                style={{ width: "100%" }}
                value={total}
                formatter={(value) =>
                  `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }
              />
            </Form.Item>
          </Col>
        </Row>
      </div>
    </>
  );
}
