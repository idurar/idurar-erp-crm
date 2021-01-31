import React, { useState, useEffect } from "react";

import {
  Table,
  PageHeader,
  Modal,
  Dropdown,
  Tag,
  Button,
  Statistic,
  Descriptions,
  Typography,
  Row,
  Col,
} from "antd";

import { UserOutlined } from "@ant-design/icons";

import { listSync } from "../axiosRequest";

export default function DataTable({ target, columns }) {
  const [state, setState] = useState({
    data: [],
    pagination: {
      defaultCurrent: 1,
      pageSize: 10,
      total: 1,
    },
    loading: false,
  });

  const fetchData = (state) => {
    const { pagination } = state;

    setState({ loading: true });
    const ajaxCall = listSync(target, { page: pagination.defaultCurrent });
    ajaxCall.then(function (response) {
      if (response === undefined || response.success === false) {
        setState({
          loading: false,
          data: [],
          pagination: { ...state.pagination },
        });
        return;
      }

      setState({
        loading: false,
        data: response.result,
        pagination: {
          defaultCurrent: response.pagination.page,
          pageSize: response.result.length,
          total: response.pagination.count,
        },
      });
    });
  };
  useEffect(() => {
    fetchData(state);
  }, []);

  const handleTableChange = (pagination) => {
    fetchData({ pagination });
  };

  const { data, pagination, loading } = state;

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
        title="Title"
        ghost={false}
        tags={<Tag color="blue">Running</Tag>}
        subTitle="This is a subtitle"
        extra={[
          <Button key="2">Refresh</Button>,
          <Button key="1" type="primary" onClick={showModal}>
            Add new Patient
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
        title="Basic Modal"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <p>Some contents...</p>
        <p>Some contents...</p>
        <p>Some contents...</p>
      </Modal>
      <Table
        columns={columns}
        rowKey={(record) => record._id}
        dataSource={data}
        pagination={pagination}
        loading={loading}
        onChange={handleTableChange}
      />
    </>
  );
}
