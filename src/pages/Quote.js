import React from "react";

import ErpPanel from "@/components/ErpPanel";
import { ErpLayout } from "@/layout";
import FormPatient from "@/forms/FormPatient";
import { Table, Tag, Radio, Space } from "antd";

export default function Quote() {
  const entity = "quote";
  const searchConfig = {
    displayLabels: ["name", "surname"],
    searchFields: "name,surname,birthday",
  };
  const entityDisplayLabels = ["number", "client.company"];
  const dataTableColumns = [
    {
      title: "Number",
      dataIndex: "number",
    },
    {
      title: "Client",
      dataIndex: ["client", "company"],
    },
    {
      title: "Date",
      dataIndex: "date",
    },
    {
      title: "Due date",
      dataIndex: "expiredDate",
    },
    {
      title: "SubTotal",
      dataIndex: "subTotal",

      render: (subTotal) =>
        `$ ${subTotal}`.replace(/\B(?=(\d{3})+(?!\d))/g, " "),
    },
    {
      title: "Total",
      dataIndex: "total",

      render: (total) => `$ ${total}`.replace(/\B(?=(\d{3})+(?!\d))/g, " "),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (status) => {
        let color = status === "Draft" ? "volcano" : "green";

        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
  ];

  const panelTitle = "quote";
  const dataTableTitle = "quotes Lists";
  const ADD_NEW_ENTITY = "Add new quote";
  const DATATABLE_TITLE = "quotes List";
  const ENTITY_NAME = "quote";
  const CREATE_ENTITY = "Create quote";
  const UPDATE_ENTITY = "Update quote";

  const config = {
    entity,
    panelTitle,
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
  return <ErpPanel config={config} />;
}
