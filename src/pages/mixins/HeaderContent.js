import React from "react";
import { Layout, Avatar, Menu, Dropdown, Button } from "antd";
import { UserOutlined } from "@ant-design/icons";
import logout from "../../auth/auth.service";
const { Header } = Layout;
import { useState, useContext } from "react";
// import { useHistory } from "react-router-dom";
import { API_BASE_URL, ACCESS_TOKEN_NAME } from "../../config/serverApiConfig";
import UserContext from "../../context/UserContext";

export default function HeaderContent() {
  const { userData, setUserData } = useContext(UserContext);

  const onLogout = () => {
    console.log(`before logout : ${userData.user.name}`);
    setUserData({
      token: undefined,
      user: undefined,
    });
    // localStorage.setItem(ACCESS_TOKEN_NAME, "");
    console.log(`after logout : ${userData.user.name}`);
    localStorage.removeItem(ACCESS_TOKEN_NAME);

    // history.push("/login");
  };
  const menu = (
    <Menu>
      <Menu.Item onClick={() => onLogout()}>logout</Menu.Item>
      {/* <Menu.Item onClick={() => logout(userData, setUserData)}>
        logout
      </Menu.Item> */}
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
      <Dropdown overlay={menu} placement="bottomRight" arrow>
        <Avatar icon={<UserOutlined />} />
      </Dropdown>
    </Header>
  );
}
