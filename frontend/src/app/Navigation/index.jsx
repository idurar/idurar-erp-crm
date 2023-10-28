import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Drawer, Layout, Menu } from 'antd';

import { useAppContext } from '@/context/appContext';
import logoIcon from '@/style/images/logo-icon.svg';
import logoText from '@/style/images/logo-text.svg';
import history from '@/utils/history';

import {
  SettingOutlined,
  CustomerServiceOutlined,
  ShopOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  FileTextOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
  CreditCardOutlined,
  MenuOutlined,
  UserAddOutlined,
  FileOutlined,
} from '@ant-design/icons';

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
  let location = useLocation();

  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  const items = [
    { key: 'dashboard', icon: <DashboardOutlined />, label: <Link to={'/'}>Dashboard</Link> },
    { key: 'lead', icon: <UserAddOutlined />, label: <Link to={'/lead'}>Lead</Link> },
    { key: 'offer', icon: <FileOutlined />, label: <Link to={'/offer'}>Offer</Link> },
    {
      key: 'customer',
      icon: <CustomerServiceOutlined />,
      label: <Link to={'/customer'}>Customer</Link>,
    },
    // { key: 'order', icon: <ShopOutlined />, label: <Link to={'/'}>Lead</Link> Order },
    // { key: 'inventory', icon: <InboxOutlined />, label: <Link to={'/'}>Lead</Link> Inventory },
    // { key: 'kyc', icon: <ShoppingCartOutlined />, label: <Link to={'/'}>Lead</Link> Kyc },
    { key: 'invoice', icon: <FileTextOutlined />, label: <Link to={'/invoice'}>Invoice</Link> },
    { key: 'quote', icon: <FileSyncOutlined />, label: <Link to={'/quote'}>Quote</Link> },
    { key: 'payment', icon: <CreditCardOutlined />, label: <Link to={'/payment'}>Payment</Link> },
    { key: 'employee', icon: <UserOutlined />, label: <Link to={'/employee'}>Employee</Link> },
    { key: 'admin', icon: <TeamOutlined />, label: <Link to={'/admin'}>Admin</Link> },
    {
      label: 'Settings',
      key: 'settings',
      icon: <SettingOutlined />,
      children: [
        {
          key: 'generalSettings',
          label: <Link to={'/settings'}>General Settings</Link>,
        },
        {
          key: 'emailTemplates',
          label: <Link to={'/email'}>Email templates</Link>,
        },
        {
          key: 'paymentMode',
          label: <Link to={'/payment/mode'}>Payment Mode</Link>,
        },
        {
          key: 'advancedSettings',
          icon: <UserOutlined />,
          label: <Link to={'/settings/advanced'}>Advanced Settings</Link>,
        },
      ],
    },
  ];

  useEffect(() => {
    if (location) if (currentPath !== location.pathname) setCurrentPath(location.pathname);
  }, [location, currentPath]);

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
        collapsible={collapsible}
        collapsed={collapsible ? isNavMenuClose : collapsible}
        onCollapse={onCollapse}
        className="navigation"
      >
        <div className="logo" onClick={() => history.push('/')} style={{ cursor: 'pointer' }}>
          <img src={logoIcon} alt="Logo" style={{ height: '32px' }} />

          {!showLogoApp && (
            <img
              src={logoText}
              alt="Logo"
              style={{ marginTop: '3px', marginLeft: '10px', height: '29px' }}
            />
          )}
        </div>
        <Menu
          items={items}
          mode="inline"
          // selectedKeys={[currentPath]}
        />
        ;
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
        open={visible}
        className="mobile-sidebar-wraper"
      >
        <Sidebar collapsible={false} />
      </Drawer>
    </>
  );
}
