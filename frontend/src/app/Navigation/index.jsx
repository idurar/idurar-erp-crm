import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button, Drawer, Layout, Menu } from 'antd';

import { useAppContext } from '@/context/appContext';
import logoIcon from '@/style/images/logo-icon.svg';
import logoText from '@/style/images/logo-text.svg';

import {
  DesktopOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  CreditCardOutlined,
  BankOutlined,
  MenuOutlined,
} from '@ant-design/icons';
import { useHistory } from 'react-router-dom/cjs/react-router-dom';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function Navigation() {
  return (
    <>
      <div className="sidebar-wraper">
        <Sidebar collapsible={true} />
      </div>
      <MobileSidebar />
    </>
  );
}

function Sidebar({ collapsible }) {
  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);
  const history = useHistory();

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
      <Sider collapsible collapsed={isNavMenuClose} onCollapse={onCollapse} className="navigation">
        <a href="/">
          <div className="logo">
            <img
              src={logoIcon}
              alt="Logo"
              // style={{ margin: "0 auto 40px", display: "block" }}
              style={{ height: '36px' }}
            />

            {!showLogoApp && (
              <img
                src={logoText}
                alt="Logo"
                style={{ marginTop: '3px', marginLeft: '10px', height: '36px' }}
              />
            )}
          </div>
        </a>

        <Menu mode="inline">
          <Menu.Item key={'Dashboard'} icon={<DashboardOutlined />}>
            <Link to={'/'} />
            Dashboard
          </Menu.Item>
          <Menu.Item key={'/customer'} icon={<CustomerServiceOutlined />}>
            Customer
          </Menu.Item>
          <Menu.Item key={'/invoice'} icon={<FileTextOutlined />}>
            Invoice
          </Menu.Item>
          <Menu.Item key={'/quote'} icon={<FileSyncOutlined />}>
            Quote
          </Menu.Item>
          <Menu.Item key={'/payment/invoice'} icon={<CreditCardOutlined />}>
            Payment Invoice
          </Menu.Item>
          <Menu.Item key={'/employee'} icon={<UserOutlined />}>
            Employee
          </Menu.Item>
          <Menu.Item key={'/admin'} icon={<TeamOutlined />}>
            Admin
          </Menu.Item>
          <SubMenu key={'Settings'} icon={<SettingOutlined />} title={'Settings'}>
            <Menu.Item key={'/settings'}>General Settings</Menu.Item>
            <Menu.Item key={'/payment/mode'}>Payment Mode</Menu.Item>
            <Menu.Item key={'/role'}>Role</Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    </>
  );
}

function MobileSidebar() {
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };
  const onClose = () => {
    setVisible(false);
  };
  return (
    <>
      <Button type="text" size="large" onClick={showDrawer} className="mobile-sidebar-btn">
        <MenuOutlined />
      </Button>
      <Drawer
        width={200}
        placement="left"
        closable={false}
        onClose={onClose}
        visible={visible}
        className="mobile-sidebar-wraper"
      >
        <Sidebar collapsible={false} />
      </Drawer>
    </>
  );
}
