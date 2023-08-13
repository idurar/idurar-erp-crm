import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Layout, Menu } from 'antd';

import { useAppContext } from '@/context/appContext';
import logoIcon from '@/style/images/logo-icon.svg';
import logoText from '@/style/images/logo-text.svg';

import {
  SettingOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  CreditCardOutlined,
} from '@ant-design/icons';

const { Sider } = Layout;
const { SubMenu } = Menu;
const DEFAULT_MOBILE_SIZE = 768;

export default function Navigation() {
  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose, isMobile } = stateApp;
  const { navMenu } = appContextAction;
  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);

  useEffect(() => {
    const handleResize = () => {
      const isSmallSize = window.innerWidth <= DEFAULT_MOBILE_SIZE;
      navMenu.setMobileSize(isSmallSize);

      if (isSmallSize) {
        onCollapse();
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [window.innerWidth]);

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

  const handleMenuItemClick = () => {
    if (isMobile) {
      navMenu.close();
    }

    return;
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
            <Link to={'/'} onClick={handleMenuItemClick} />
            Dashboard
          </Menu.Item>
          <Menu.Item key={'Customer'} icon={<CustomerServiceOutlined />}>
            <Link to={'/customer'} onClick={handleMenuItemClick} />
            Customer
          </Menu.Item>
          <Menu.Item key={'Invoice'} icon={<FileTextOutlined />}>
            <Link to={'/invoice'} onClick={handleMenuItemClick} />
            Invoice
          </Menu.Item>
          <Menu.Item key={'Quote'} icon={<FileSyncOutlined />}>
            <Link to={'/quote'} onClick={handleMenuItemClick} />
            Quote
          </Menu.Item>
          <Menu.Item key={'PaymentInvoice'} icon={<CreditCardOutlined />}>
            <Link to={'/payment/invoice'} onClick={handleMenuItemClick} />
            Payment Invoice
          </Menu.Item>
          <Menu.Item key={'Employee'} icon={<UserOutlined />}>
            <Link to={'/employee'} onClick={handleMenuItemClick} />
            Employee
          </Menu.Item>
          <Menu.Item key={'Admin'} icon={<TeamOutlined />}>
            <Link to={'/admin'} onClick={handleMenuItemClick} />
            Admin
          </Menu.Item>
          <SubMenu key={'Settings'} icon={<SettingOutlined />} title={'Settings'}>
            <Menu.Item key={'SettingsPage'}>
              <Link to={'/settings'} onClick={handleMenuItemClick} />
              General Settings
            </Menu.Item>
            <Menu.Item key={'PaymentMode'}>
              <Link to={'/payment/mode'} onClick={handleMenuItemClick} />
              Payment Mode
            </Menu.Item>
            <Menu.Item key={'Role'}>
              <Link to={'/role'} onClick={handleMenuItemClick} />
              Role
            </Menu.Item>
          </SubMenu>
        </Menu>
      </Sider>
    </>
  );
}
