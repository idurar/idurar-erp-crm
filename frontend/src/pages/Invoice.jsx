import React from "react";
import dayjs from "dayjs";
import InvoiceModule from "@/modules/InvoiceModule";

import { Tag } from "antd";

export default function Invoice() {
  const entity = "invoice";
  const searchConfig = {
    displayLabels: ["name", "surname"],
    searchFields: "name,surname,birthday",
  };
  const entityDisplayLabels = ["number", "client.company"];
  const dataTableColumns = [
    {
      title: "#N",
      dataIndex: "number",
    },
    {
      title: "Client",
      dataIndex: ["client", "company"],
    },
    {
      title: "Date",
      dataIndex: "date",
      render: (date) => {
        return dayjs(date).format("DD/MM/YYYY");
      },
    },
    {
      title: "Due date",
      dataIndex: "expiredDate",
      render: (date) => {
        return dayjs(date).format("DD/MM/YYYY");
      },
    },
    {
      title: "Total",
      dataIndex: "total",

      render: (total) => {
        return {
          props: {
            style: {
              textAlign: "right",
              whiteSpace: "nowrap",
            },
          },
          children: (
            <>$ {total.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</>
          ),
        };
      },
    },
    {
      title: "Balance",
      dataIndex: "credit",

      render: (credit) => {
        return {
          props: {
            style: {
              textAlign: "right",
              whiteSpace: "nowrap",
            },
          },
          children: (
            <>$ {credit.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</>
          ),
        };
      },
    },
    {
      title: "status",
      dataIndex: "status",
      render: (status) => {
        let color =
          status === "draft" ? "cyan" : status === "sent" ? "magenta" : "gold";

        return <Tag color={color}>{status && status.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Payment",
      dataIndex: "paymentStatus",
      render: (paymentStatus) => {
        let color =
          paymentStatus === "unpaid"
            ? "volcano"
            : paymentStatus === "paid"
            ? "green"
            : paymentStatus === "overdue"
            ? "red"
            : "purple";

        return (
          <Tag color={color}>
            {paymentStatus && paymentStatus.toUpperCase()}
          </Tag>
        );
      },
    },
  ];

  const PANEL_TITLE = "invoice";
  const dataTableTitle = "invoices Lists";
  const ADD_NEW_ENTITY = "Add new invoice";
  const DATATABLE_TITLE = "invoices List";
  const ENTITY_NAME = "invoice";
  const CREATE_ENTITY = "Create invoice";
  const UPDATE_ENTITY = "Update invoice";

  const config = {
    entity,
    PANEL_TITLE,
    dataTableTitle,
    ENTITY_NAME,
    CREATE_ENTITY,
    ADD_NEW_ENTITY,
    UPDATE_ENTITY,
    DATATABLE_TITLE,
    dataTableColumns,
    searchConfig,
    entityDisplayLabels,
  };
  return <InvoiceModule config={config} />;
}
