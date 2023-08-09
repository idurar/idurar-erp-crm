import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

import { useAppContext } from '@/context/appContext';
import logo from '@/style/images/logo.svg';

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
} from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function Navigation() {
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
      <Sider collapsible collapsed={isNavMenuClose} onCollapse={onCollapse} className="navigation">
        <a href="/">
          <div className="logo">
            <img src={logo} alt="Logo" style={{ margin: '0 auto 40px', height: '33px' }} />
          </div>
        </a>

        <Menu mode="inline">
          <Menu.Item key={'Dashboard'} icon={<DashboardOutlined />}>
            <Link to={'/'} />
            Dashboard
          </Menu.Item>
          <Menu.Item key={'Customer'} icon={<CustomerServiceOutlined />}>
            <Link to={'/customer'} />
            Customer
          </Menu.Item>
          <Menu.Item key={'Invoice'} icon={<FileTextOutlined />}>
            <Link to={'/invoice'} />
            Invoice
          </Menu.Item>
          <Menu.Item key={'Quote'} icon={<FileSyncOutlined />}>
            <Link to={'/quote'} />
            Quote
          </Menu.Item>
          <Menu.Item key={'PaymentInvoice'} icon={<CreditCardOutlined />}>
            <Link to={'/payment/invoice'} />
            Payment Invoice
          </Menu.Item>
          <Menu.Item key={'Employee'} icon={<UserOutlined />}>
            <Link to={'/employee'} />
            Employee
          </Menu.Item>
          <Menu.Item key={'Admin'} icon={<TeamOutlined />}>
            <Link to={'/admin'} />
            Admin
          </Menu.Item>
          <SubMenu key={'Settings'} icon={<SettingOutlined />} title={'Settings'}>
            <Menu.Item key={'SettingsPage'}>
              <Link to={'/settings'} />
              General Settings
            </Menu.Item>
            <Menu.Item key={'PaymentMode'}>
              <Link to={'/payment/mode'} />
              Payment Mode
            </Menu.Item>
            <Menu.Item key={'Role'}>
              <Link to={'/role'} />
              Role
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    </>
  );
}
