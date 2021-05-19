import React, { useState, useEffect, useRef } from "react";
import { Divider } from "antd";

import {
  Button,
  PageHeader,
  Row,
  Col,
  Descriptions,
  Statistic,
  Tag,
} from "antd";
import { EditOutlined, FilePdfOutlined } from "@ant-design/icons";

import { useSelector, useDispatch } from "react-redux";
import { invoice } from "@/redux/invoice/actions";

import { useInvoiceContext } from "@/context/invoice";
import uniqueId from "@/utils/uniqueId";

import { selectCurrentItem, selectItemById } from "@/redux/invoice/selectors";

import { valueByString } from "@/utils/helpers";
import { DOWNLOAD_BASE_URL } from "@/config/serverApiConfig";

const Item = ({ item }) => {
  console.info("item item : ", item);
  return (
    <Row gutter={[12, 0]} key={item._id}>
      <Col className="gutter-row" span={11}>
        <p style={{ marginBottom: 5 }}>
          <strong>{item.itemName}</strong>
        </p>
        <p>{item.description}</p>
      </Col>
      <Col className="gutter-row" span={4}>
        <p
          style={{
            textAlign: "right",
          }}
        >
          {item.price.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
        </p>
      </Col>
      <Col className="gutter-row" span={4}>
        <p
          style={{
            textAlign: "right",
          }}
        >
          {item.quantity}
        </p>
      </Col>
      <Col className="gutter-row" span={5}>
        <p
          style={{
            textAlign: "right",
            fontWeight: "700",
          }}
        >
          {item.total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
        </p>
      </Col>
      <Divider dashed style={{ marginTop: 0, marginBottom: 15 }} />
    </Row>
  );
};

export default function ReadInvoice({ config }) {
  const { entity } = config;
  const dispatch = useDispatch();
  const { invoiceContextAction } = useInvoiceContext();

  const { result: currentResult } = useSelector(selectCurrentItem);
  const { state } = useInvoiceContext();

  const { readPanel, updatePanel } = invoiceContextAction;

  const [itemslist, setItemsList] = useState([]);
  const [currentInvoice, setCurrentInvoice] = useState({
    status: "",
    client: {
      company: "",
      email: "",
      phone: "",
      address: "",
    },
    subTotal: 0,
    taxTotal: 0,
    taxRate: 0,
    total: 0,
    credit: 0,
    number: 0,
    year: 0,
  });

  useEffect(() => {
    if (currentResult) {
      const { items } = currentResult;

      setItemsList(items);
      setCurrentInvoice(currentResult);
    }
  }, [currentResult]);

  useEffect(() => {
    console.info("itemslist", itemslist);
  }, [itemslist]);

  return (
    <>
      <PageHeader
        onBack={() => readPanel.close()}
        title={`Invoice # ${currentInvoice.number}/${
          currentInvoice.year || ""
        }`}
        ghost={false}
        tags={<Tag color="volcano">Draft</Tag>}
        subTitle="This is cuurent invoice page"
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              window.open(
                `${DOWNLOAD_BASE_URL}${entity}/${entity}-${currentInvoice._id}.pdf`,
                "_blank"
              );
            }}
            icon={<FilePdfOutlined />}
          >
            Download PDF
          </Button>,
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              dispatch(invoice.currentAction("update", currentInvoice));
              updatePanel.open();
            }}
            type="primary"
            icon={<EditOutlined />}
          >
            Edit Invoice
          </Button>,
        ]}
        style={{
          padding: "20px 0px",
        }}
      >
        <Row>
          <Statistic title="Status" value={currentInvoice.status} />
          <Statistic
            title="SubTotal"
            prefix="$"
            value={currentInvoice.subTotal}
            style={{
              margin: "0 32px",
            }}
          />
          <Statistic
            title="Total"
            prefix="$"
            value={currentInvoice.total}
            style={{
              margin: "0 32px",
            }}
          />
          <Statistic
            title="Balance"
            prefix="$"
            value={currentInvoice.credit}
            style={{
              margin: "0 32px",
            }}
          />
        </Row>
      </PageHeader>
      <Divider dashed />
      <Descriptions title={`Client : ${currentInvoice.client.company}`}>
        <Descriptions.Item label="Address">
          {currentInvoice.client.address}
        </Descriptions.Item>
        <Descriptions.Item label="E-mail">
          {currentInvoice.client.email}
        </Descriptions.Item>
        <Descriptions.Item label="Phone">
          {currentInvoice.client.phone}
        </Descriptions.Item>
      </Descriptions>
      <Divider />
      <Row gutter={[12, 0]}>
        <Col className="gutter-row" span={11}>
          <p>
            <strong>ITEM</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={4}>
          <p
            style={{
              textAlign: "right",
            }}
          >
            <strong>PRICE</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={4}>
          <p
            style={{
              textAlign: "right",
            }}
          >
            <strong>QUANTITY</strong>
          </p>
        </Col>
        <Col className="gutter-row" span={5}>
          <p
            style={{
              textAlign: "right",
            }}
          >
            <strong>TOTAL</strong>
          </p>
        </Col>
        <Divider />
      </Row>
      {itemslist.map((item) => (
        <Item key={item._id} item={item}></Item>
      ))}
      <div
        style={{
          width: "300px",
          float: "right",
          textAlign: "right",
          fontWeight: "700",
        }}
      >
        <Row gutter={[12, -5]}>
          <Col className="gutter-row" span={12}>
            <p>Sub Total :</p>
          </Col>

          <Col className="gutter-row" span={12}>
            <p>
              {`$ `}
              {currentInvoice.subTotal
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
            </p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>Tax Total ({currentInvoice.taxRate * 100} %) :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {`$ `}
              {currentInvoice.taxTotal
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
            </p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>Total :</p>
          </Col>
          <Col className="gutter-row" span={12}>
            <p>
              {`$ `}
              {currentInvoice.total
                .toFixed(2)
                .replace(/\B(?=(\d{3})+(?!\d))/g, " ")}
            </p>
          </Col>
        </Row>
      </div>
    </>
  );
}
