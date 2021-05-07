import React, { useLayoutEffect } from "react";
import { Row, Col, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DataTable from "./DataTable";
import CreateInvoice from "./CreateInvoice";
import Update from "./UpdateInvoice";
import Delete from "./DeleteInvoice";
import Read from "./ReadInvoice";
import Search from "./SearchInvoice";

import { useDispatch } from "react-redux";
import { invoice } from "@/redux/invoice/actions";
import { useUiContext } from "@/context/ui";

import { InvoiceLayout } from "@/layout";

export default function InvoicePanel({ config, createForm, updateForm }) {
  const dispatch = useDispatch();
  let form = {};
  updateForm === undefined ? (form = createForm) : (form = updateForm);

  useLayoutEffect(() => {
    dispatch(invoice.resetState());
  }, []);

  return (
    <InvoiceLayout config={config}>
      {/* <DataTable config={config} /> */}
      <CreateInvoice config={config} />
      <Delete config={config} />
    </InvoiceLayout>
  );
}
