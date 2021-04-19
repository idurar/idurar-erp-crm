import React from "react";
import { Modal } from "antd";
import { useUiContext } from "@/context/ui";

export default function GlobalModal({ children }) {
  const { state, uiContextAction } = useUiContext();
  const { isModalOpen } = state;
  const { modal } = uiContextAction;

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
