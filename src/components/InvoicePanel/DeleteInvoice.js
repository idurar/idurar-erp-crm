import React, { useEffect, useState } from "react";
import { Modal } from "antd";

import { useDispatch, useSelector } from "react-redux";
import { invoice } from "@/redux/invoice/actions";
import { useInvoiceContext } from "@/context/invoice";
import { selectDeletedItem } from "@/redux/invoice/selectors";
import { valueByString } from "@/utils/helpers";

export default function Delete({ config }) {
  let {
    entity,
    entityDisplayLabels,
    deleteMessage = "Do you want delete : ",
    deleteModalDelete = "Remove Item",
  } = config;
  const dispatch = useDispatch();
  const { current, isLoading, isSuccess } = useSelector(selectDeletedItem);
  const { state, invoiceContextAction } = useInvoiceContext();
  const { isModalOpen } = state;
  const { modal } = invoiceContextAction;
  const [displayItem, setDisplayItem] = useState("");

  useEffect(() => {
    if (isSuccess) modal.close();
    if (current) {
      let labels = entityDisplayLabels
        .map((x) => valueByString(current, x))
        .join(" ");

      setDisplayItem(labels);
    }
  }, [isSuccess, current]);

  const handleOk = () => {
    const id = current._id;
    dispatch(invoice.delete(entity, id));
  };
  const handleCancel = () => {
    if (!isLoading) modal.close();
  };
  return (
    <Modal
      title={deleteModalDelete}
      visible={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading}
    >
      <p>
        {deleteMessage}
        {displayItem}
      </p>
    </Modal>
  );
}
