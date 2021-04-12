import React, { useState, useCallback, useEffect } from "react";
import {
  Dropdown,
  Menu,
  Button,
  PageHeader,
  Row,
  Statistic,
  Table,
  Tag,
  Modal,
} from "antd";
import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useSelector, useDispatch } from "react-redux";
import FormCustomer from "./formCustomer";
import { listAction } from "@/redux/crud/actions";
import { selectListItems } from "@/redux/crud/selectors";

const [isModalVisible, setIsModalVisible] = useState(false);

const showModal = () => {
  setIsModalVisible(true);
};

const handleOk = () => {
  setIsModalVisible(false);
};

const handleCancel = () => {
  setIsModalVisible(false);
};

export default function CustomerTable({ entity, columns }) {
  return (
    <>
      <Modal
        title="Add new Patient"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={null}
      >
        <FormCustomer
          entity={entity}
          closeModel={() => {
            setIsModalVisible(false);
          }}
        />
      </Modal>{" "}
    </>
  );
}
