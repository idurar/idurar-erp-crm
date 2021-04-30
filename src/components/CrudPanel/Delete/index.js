import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import Loading from "@/components/Loading";
import { useDispatch, useSelector } from "react-redux";
import { deleteAction } from "@/redux/crud/actions";
import { useUiContext } from "@/context/ui";
import { selectDeletedItem } from "@/redux/crud/selectors";

export default function Delete({ entity }) {
  const dispatch = useDispatch();
  const { current, result, isLoading, isSuccess } = useSelector(
    selectDeletedItem
  );
  const { state, uiContextAction } = useUiContext();
  const { isModalOpen } = state;
  const { modal } = uiContextAction;
  const [displayItem, setDisplayItem] = useState("");

  useEffect(() => {
    if (isSuccess) modal.close();
    if (current) setDisplayItem(current._id);
  }, [isSuccess, current]);

  const handleOk = () => {
    const id = current._id;
    dispatch(deleteAction(entity, id));
  };
  const handleCancel = () => {
    if (!isLoading) modal.close();
  };
  return (
    <Modal
      title="Remove Item"
      visible={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      confirmLoading={isLoading}
    >
      <p>Do you want delete : {displayItem}</p>
    </Modal>
  );
}
