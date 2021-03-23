import React, { useState } from 'react';
import { Button, PageHeader, Row, Statistic, Table, Tag } from 'antd';
import { connect } from 'react-redux';
import Modal from 'antd/lib/modal/Modal';
import FormCustomer from './formCustomer';



const CustomerTable = ({columns, customer}) => {

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
  return(
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
        <FormCustomer />
      </Modal>
      <Table 
        columns={columns}
        rowKey={(record) => record._id}
        //customer is the data from redux
        dataSource={customer}
      />
    </>
  )
}
const mapStateToProps = (state) => {
  return {
    customer: state.customer.customers
  };
};

export default connect(mapStateToProps, null)(CustomerTable);