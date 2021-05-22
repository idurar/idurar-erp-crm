import React from "react";
import { Modal } from "antd";
import { useCrudContext } from "@/context/crud";

export default function GlobalModal({ children }) {
  const { state, crudContextAction } = useCrudContext();
  const { isModalOpen } = state;
  const { modal } = crudContextAction;

  const handleOk = () => {
    modal.close();
  };
  const handleCancel = () => {
    modal.close();
  };
  return (
    <Modal
      title="Add new Patient"
      visible={isModalOpen}
      onOk={handleOk}
      onCancel={handleCancel}
      footer={null}
    >
      {children}
    </Modal>
  );
}
