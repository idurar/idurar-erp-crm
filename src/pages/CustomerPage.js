import React from "react";
import DashboardLayout from "./layout/DashboardLayout";
import { Dropdown, Layout, Menu } from "antd";
import { MoreOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from "@ant-design/icons"
import CustomerTable from "../components/customerTable";

const { Content } = Layout;

const menu = row => {

  function Show(){
    console.log(row._id)
  }
  function Edit(){
    console.log(row._id)
  }
  function Delete(){
    console.log(row._id)
  }

  return(
    <Menu>
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
  )
}

function CustomerPage() {
  const entity = "client";
  const columns = [
    {
      title: "Company",
      dataIndex: "company",
    },
    {
      title: "Manager Surname",
      dataIndex: "managerSurname",
    },
    {
      title: "Manager Name",
      dataIndex: "managerName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Action",
      render : row => (
        <Dropdown overlay={menu(row)} >
          <MoreOutlined  style={{cursor: "pointer"}}/>
        </Dropdown>
      )
    }
  ];

  return (
    <DashboardLayout
      contentLayout={
        <Content style={{ margin: "0 16px" }}>
          <CustomerTable entity={entity} columns={columns} />
        </Content>
      }
    />
  );
}

export default CustomerPage;
