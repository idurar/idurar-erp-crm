import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";
import {
  DesktopOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { useAppContext } from "@/context/appContext";
import logoIcon from "@/style/images/logo-icon.png";
import logoMenu from "@/style/images/logo-menu.png";
const { Sider } = Layout;
const { SubMenu } = Menu;

function Navigation() {
  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);

  useEffect(() => {
    if (isNavMenuClose) {
      setLogoApp(isNavMenuClose);
    }
    const timer = setTimeout(() => {
      if (!isNavMenuClose) {
        setLogoApp(isNavMenuClose);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [isNavMenuClose]);
  const onCollapse = () => {
    navMenu.collapse();
  };
  return (
    <>
      <Sider
        collapsible
        collapsed={isNavMenuClose}
        onCollapse={onCollapse}
        className="navigation"
      >
        <div className="logo">
          {showLogoApp && (
            <img
              src={logoIcon}
              alt="Logo"
              // style={{ margin: "0 auto 40px", display: "block" }}
            />
          )}
          {!showLogoApp && (
            <img
              src={logoMenu}
              alt="Logo"
              // style={{ margin: "0 auto 40px", display: "block" }}
            />
          )}
        </div>
        <Menu defaultSelectedKeys={["1"]} mode="inline">
          <Menu.Item key="1" icon={<DashboardOutlined />}>
            <Link to="/" />
            Home Page
          </Menu.Item>
          <Menu.Item key="2">
            <Link to="/customer">
              <CustomerServiceOutlined />
              <span>Customer</span>
            </Link>
          </Menu.Item>
          <Menu.Item key="21" icon={<FileTextOutlined />}>
            <Link to="/invoice" />
            Invoice
          </Menu.Item>
          <Menu.Item key="3" icon={<FileSyncOutlined />}>
            <Link to="/quote" />
            Quote
          </Menu.Item>
          <Menu.Item key="31" icon={<TeamOutlined />}>
            <Link to="/admin" />
            Admins Management
          </Menu.Item>

          <Menu.Item key="32" icon={<SettingOutlined />}>
            <Link to="/settings" />
            Settings
          </Menu.Item>
          {/* <SubMenu key="sub1" icon={<UserOutlined />} title="Admin">
            <Menu.Item key="4">Tom</Menu.Item>
            <Menu.Item key="5">Bill</Menu.Item>
            <Menu.Item key="6">Alex</Menu.Item>
          </SubMenu>
          <SubMenu key="sub2" icon={<TeamOutlined />} title="Team">
            <Menu.Item key="7">Team 1</Menu.Item>
            <Menu.Item key="8">Team 2</Menu.Item>
          </SubMenu> */}
        </Menu>
      </Sider>
    </>
  );
}
export default Navigation;
