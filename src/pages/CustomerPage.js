import React from "react";
import DashboardLayout from "./layout/DashboardLayout";
import { Dropdown, Layout, Menu } from "antd";
import {
  EllipsisOutlined,
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import CustomerTable from "../components/customerTable";

const { Content } = Layout;

// const menu = (row) => {
//   function Show() {
//     console.log(row._id);
//   }
//   function Edit() {
//     console.log(row._id);
//   }
//   function Delete() {
//     console.log(row._id);
//   }

//   return (
//     <Menu style={{ width: 120 }}>
//       <Menu.Item icon={<EyeOutlined />} onClick={Show}>
//         Show
//       </Menu.Item>
//       <Menu.Item icon={<EditOutlined />} onClick={Edit}>
//         Edit
//       </Menu.Item>
//       <Menu.Item icon={<DeleteOutlined />} onClick={Delete}>
//         Delete
//       </Menu.Item>
//     </Menu>
//   );
// };

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
    // {
    //   title: "",
    //   render: (row) => (
    //     <Dropdown overlay={menu(row)} trigger={["click"]}>
    //       <EllipsisOutlined style={{ cursor: "pointer", fontSize: "24px" }} />
    //     </Dropdown>
    //   ),
    // },
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
