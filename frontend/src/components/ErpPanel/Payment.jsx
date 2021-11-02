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
import {
  EditOutlined,
  FilePdfOutlined,
  RollbackOutlined,
  PlusCircleOutlined,
} from "@ant-design/icons";

import { useSelector, useDispatch } from "react-redux";
import { erp } from "@/redux/erp/actions";

import { useErpContext } from "@/context/erp";
import uniqueId from "@/utils/uinqueId";

import { selectRecordPaymentItem, selectItemById } from "@/redux/erp/selectors";

import { DOWNLOAD_BASE_URL } from "@/config/serverApiConfig";

import RecordPayment from "./RecordPayment";

export default function Payment({ config }) {
  const { entity, ENTITY_NAME } = config;
  const dispatch = useDispatch();
  const { erpContextAction } = useErpContext();

  const { current: currentItem } = useSelector(selectRecordPaymentItem);

  const { readPanel, updatePanel } = erpContextAction;

  const [itemslist, setItemsList] = useState([]);
  const [currentErp, setCurrentErp] = useState({
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
    if (currentItem) {
      const { items } = currentItem;

      setItemsList(items);
      setCurrentErp(currentItem);
    }
  }, [currentItem]);

  useEffect(() => {
    console.info("itemslist", itemslist);
  }, [itemslist]);

  return (
    <>
      <PageHeader
        onBack={() => readPanel.close()}
        title={`${ENTITY_NAME} # ${currentErp.number}/${currentErp.year || ""}`}
        ghost={false}
        tags={<Tag color="volcano">Draft</Tag>}
        // subTitle="This is cuurent erp page"
        extra={[
          <Button
            key={`${uniqueId()}`}
            onClick={() => {
              window.open(
                `${DOWNLOAD_BASE_URL}${entity}/${entity}-${currentErp._id}.pdf`,
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
              dispatch(erp.currentAction("update", currentErp));
              updatePanel.open();
            }}
            type="primary"
            icon={<EditOutlined />}
          >
            Edit Erp
          </Button>,
        ]}
        style={{
          padding: "20px 0px",
        }}
      >
        <Row>
          <Statistic title="Status" value={currentErp.status} />
          <Statistic
            title="SubTotal"
            prefix="$"
            value={currentErp.subTotal}
            style={{
              margin: "0 32px",
            }}
          />
          <Statistic
            title="Total"
            prefix="$"
            value={currentErp.total}
            style={{
              margin: "0 32px",
            }}
          />
          <Statistic
            title="Balance"
            prefix="$"
            value={currentErp.credit}
            style={{
              margin: "0 32px",
            }}
          />
        </Row>
      </PageHeader>
      <Divider dashed />

      <Row gutter={[12, 12]}>
        <Col
          className="gutter-row"
          xs={{ span: 24, order: 2 }}
          sm={{ span: 24, order: 2 }}
          md={{ span: 11, order: 1 }}
          lg={{ span: 11, order: 1 }}
        >
          <p>
            <strong>ITEM</strong>
          </p>
        </Col>
        <Col
          className="gutter-row"
          xs={{ span: 0, order: 2 }}
          sm={{ span: 0, order: 2 }}
          md={{ span: 1, order: 2 }}
          lg={{ span: 2, order: 2 }}
          style={{ display: "flex", justifyContent: "center" }}
        >
          <Divider style={{ padding: "10px 0" }} type="vertical"></Divider>
        </Col>
        <Col
          className="gutter-row"
          xs={{ span: 24, order: 1 }}
          sm={{ span: 24, order: 1 }}
          md={{ span: 12, order: 3 }}
          lg={{ span: 11, order: 3 }}
        >
          <RecordPayment config={config} />
        </Col>
      </Row>
    </>
  );
}
