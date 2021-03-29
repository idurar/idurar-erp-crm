import React, { useState, useContext } from "react";
import { useDispatch } from "react-redux";
import NavigationContext from "../context/NavigationContext";
import { Layout, Avatar, Menu, Dropdown, Button } from "antd";

import { MenuOutlined, UserOutlined } from "@ant-design/icons";
import { logout } from "../redux/auth/actions";
const { Header } = Layout;

// import { useHistory } from "react-router-dom";

export default function HeaderContent() {
  // const { setUserData } = useContext(UserContext);
  const dispatch = useDispatch();
  const { collapsed, setCollapsed } = useContext(NavigationContext);

  const menu = (
    <Menu>
      {/* <Menu.Item onClick={onLogout}>logout</Menu.Item> */}
      <Menu.Item onClick={() => dispatch(logout())}>logout</Menu.Item>
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
    <Header
      className="site-layout-background"
      style={{ padding: 0, background: "none" }}
    >
      <MenuOutlined
        className="trigger"
        style={{ fontSize: "20px", paddingLeft: "30px" }}
        onClick={() => setCollapsed(!collapsed)}
      />
      {/* <p>{userData.user.name}</p> */}

      <Dropdown overlay={menu} placement="bottomRight" arrow>
        <Avatar icon={<UserOutlined />} />
      </Dropdown>
    </Header>
  );
}
