import React, { useLayoutEffect } from "react";

import { Row, Col, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DataTable from "./DataTable";
import CreateInvoice from "./CreateInvoice";
import { useSearchBox } from "@/components/SearchBox";
import UpdateInvoice from "./UpdateInvoice";
import Delete from "./DeleteInvoice";
import Read from "./ReadInvoice";
import Search from "./SearchInvoice";

import { useDispatch } from "react-redux";
import { invoice } from "@/redux/invoice/actions";
import { search } from "@/redux/search/actions";
import { useUiContext } from "@/context/ui";

import { InvoiceLayout } from "@/layout";

export default function InvoicePanel({ config }) {
  const dispatch = useDispatch();
  const { selected } = useSearchBox("client");
  useLayoutEffect(() => {
    dispatch(invoice.resetState());
    dispatch(search.resetState());
    dispatch(search.init(["client"]));
  }, []);

  return (
    <InvoiceLayout config={config}>
      <DataTable config={config} />
      <UpdateInvoice config={config} />
      {/* <CreateInvoice config={config} /> */}
      <Delete config={config} />
    </InvoiceLayout>
  );
}
