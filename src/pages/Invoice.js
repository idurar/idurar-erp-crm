import React from "react";

import InvoicePanel from "@/components/InvoicePanel";
import { InvoiceLayout } from "@/layout";
import FormPatient from "@/forms/FormPatient";
import { Table, Tag, Radio, Space } from "antd";

export default function Invoice() {
  const entity = "invoice";
  const searchConfig = {
    displayLabels: ["name", "surname"],
    searchFields: "name,surname,birthday",
  };
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
  const readColumns = [
    {
      title: "Nom",
      dataIndex: "name",
    },
    {
      title: "Prenom",
      dataIndex: "surname",
    },
    {
      title: "Date de naissance",
      dataIndex: "birthday",
    },
    {
      title: "Sexe",
      dataIndex: "sexe",
    },
  ];
  const panelTitle = "invoice";
  const dataTableTitle = "invoices Lists";
  const config = {
    entity,
    panelTitle,
    dataTableTitle,
    readColumns,
    dataTableColumns,
    searchConfig,
  };
  return <InvoicePanel config={config} />;
}
