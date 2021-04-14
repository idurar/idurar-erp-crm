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
const dropDownRowMenu = (currentRow) => {
  function Show() {
    console.log(currentRow._id);
  }
  function Edit() {
    console.log(currentRow._id);
  }
  function Delete() {
    console.log(currentRow._id);
  }

  return (
    <Menu style={{ width: 130 }}>
      <Menu.Item icon={<EyeOutlined />} onClick={Show}>
        Show
      </Menu.Item>
      <Menu.Item icon={<EditOutlined />} onClick={Edit}>
        Edit
      </Menu.Item>
      <Menu.Item icon={<DeleteOutlined />} onClick={Delete}>
        Delete
      </Menu.Item>
    </Menu>
  );
};

export default function CustomerTable({ entity, columns }) {
  columns = [
    ...columns,
    {
      title: "",
      render: (row) => (
        <Dropdown overlay={dropDownRowMenu(row)} trigger={["click"]}>
          <EllipsisOutlined style={{ cursor: "pointer", fontSize: "24px" }} />
        </Dropdown>
      ),
    },
  ];
  const dispatch = useDispatch();

  let {
    result: listResult,
    isLoading: listIsLoading,
    isSuccess: listIsSuccess,
  } = useSelector(selectListItems);
  const { pagination } = listResult;

  const handelDataTableLoad = useCallback((pagination) => {
    dispatch(listAction(entity, pagination.current));
  }, []);
  // const handelDataTableLoad = (listResult) => {

  // };
  useEffect(() => {
    handelDataTableLoad(pagination);
  }, []);
  // const handelDataTableLoad = useCallback(() => {
  //   handelDataTableLoad(listResult);
  // }, []);
  // const handleTableChange = (pagination) => {
  //   handelDataTableLoad({ pagination });
  // };

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
  return (
    <>
      <PageHeader
        onBack={() => window.history.back()}
        title="Customer Page"
        ghost={false}
        tags={<Tag color="blue">Running</Tag>}
        subTitle="This is customer page"
        extra={[
          <Button key="2">Refresh</Button>,
          <Button key="1" type="primary" onClick={showModal}>
            Add new Customer
          </Button>,
        ]}
        style={{
          padding: "20px 0px",
        }}
      >
        <Row>
          <Statistic title="Status" value="Pending" />
          <Statistic
            title="Price"
            prefix="$"
            value={568.08}
            style={{
              margin: "0 32px",
            }}
          />
          <Statistic title="Balance" prefix="$" value={3345.08} />
        </Row>
      </PageHeader>
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
      </Modal>

      <Table
        columns={columns}
        rowKey={(item) => item._id}
        dataSource={listResult.items}
        pagination={listResult.pagination}
        loading={listIsLoading}
        onChange={handelDataTableLoad}
      />
    </>
  );
}
