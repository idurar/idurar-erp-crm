import React from "react";
import { Layout, Avatar, Menu, Dropdown, Button } from "antd";
import { Row, Col } from "antd";
import { UserOutlined } from "@ant-design/icons";
import { logout } from "../../auth/auth.service";
const { Header } = Layout;
import { useState, useContext } from "react";
// import { useHistory } from "react-router-dom";

import UserContext from "../../context/UserContext";

export default function HeaderContent() {
  const { setUserData } = useContext(UserContext);

  const menu = (
    <Menu>
      {/* <Menu.Item onClick={onLogout}>logout</Menu.Item> */}
      <Menu.Item onClick={() => logout(setUserData)}>logout</Menu.Item>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.taobao.com/"
        >
          2nd menu item
        </a>
      </Menu.Item>
      <Menu.Item>
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="http://www.tmall.com/"
        >
          3rd menu item
        </a>
      </Menu.Item>
    </Menu>
  );
  return (
    <Header className="site-layout-background" style={{ padding: 0 }}>
      {/* <p>{userData.user.name}</p> */}

      <Dropdown overlay={menu} placement="bottomRight" arrow>
        <Avatar icon={<UserOutlined />} />
      </Dropdown>
    </Header>
  );
}
