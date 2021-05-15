import React, { useLayoutEffect } from "react";

import { Row, Col, Button } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import DataTable from "./DataTable";
import CreateInvoice from "./CreateInvoice";
import { useSearchBox } from "@/components/SearchBox";
import UpdateInvoice from "./UpdateInvoice";
import Delete from "./DeleteInvoice";
import ReadInvoice from "./ReadInvoice";
import Search from "./SearchInvoice";

import { useDispatch } from "react-redux";
import { invoice } from "@/redux/invoice/actions";
import { search } from "@/redux/search/actions";
import { useInvoiceContext } from "@/context/invoice";

const Visibility = ({ isVisible, children }) => {
  const show = isVisible
    ? { display: "block", opacity: 1 }
    : { display: "none", opacity: 0 };
  return <div style={show}>{children}</div>;
};

export default function IndexInvoicePanel({ config }) {
  const dispatch = useDispatch();
  const { selected } = useSearchBox("client");
  const { state } = useInvoiceContext();
  const { update, read, create, listDataTable, deleteModal } = state;
  useLayoutEffect(() => {
    dispatch(invoice.resetState());
    dispatch(search.resetState());
    dispatch(search.init(["client"]));
  }, []);

  return (
    <>
      <Visibility isVisible={listDataTable.isOpen}>
        <DataTable config={config} />
      </Visibility>
      <Visibility isVisible={read.isOpen}>
        <ReadInvoice config={config} />
      </Visibility>
      <Visibility isVisible={update.isOpen}>
        <UpdateInvoice config={config} />
      </Visibility>
      <Visibility isVisible={create.isOpen}>
        <CreateInvoice config={config} />
      </Visibility>

      <Delete config={config} isVisible={deleteModal.isOpen} />
    </>
  );
}
