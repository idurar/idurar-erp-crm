import React, { useState, useEffect } from "react";
import { Button, PageHeader, Row, Statistic, Table, Tag } from "antd";
import { useSelector, useDispatch } from "react-redux";
import Modal from "antd/lib/modal/Modal";
import FormCustomer from "./formCustomer";
import { loadCustomers } from "../redux/customer/actions";

export default function CustomerTable({ entity, columns }) {
  const dispatch = useDispatch();

  let customers = useSelector((state) => state.customers);

  const handelDataTableLoad = (customers) => {
    const { pagination } = customers;
    dispatch(loadCustomers(entity, pagination.current));
  };
  useEffect(() => {
    handelDataTableLoad(customers);
  }, []);

  const handleTableChange = (pagination) => {
    handelDataTableLoad({ pagination });
  };

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
        rowKey={(record) => record._id}
        dataSource={customers.list}
        pagination={customers.pagination}
        loading={customers.loading}
        onChange={handleTableChange}
      />
    </>
  );
}
