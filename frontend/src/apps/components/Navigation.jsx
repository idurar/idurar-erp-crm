import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button, Drawer, Layout, Menu } from 'antd';

import { useAppContext } from '@/context/appContext';

import useLanguage from '@/locale/useLanguage';
import logoIcon from '@/style/images/logo-icon.svg';
import logoText from '@/style/images/logo-text.svg';
import { useNavigate } from 'react-router-dom';

import {
  SettingOutlined,
  CustomerServiceOutlined,
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

const NAV_LINK_PATTERN = {
  offer: /^\/offer(\/create)?$/i,
  invoice: /^\/invoice(\/create)?$/i,
  quote: /^\/quote(\/create)?$/i,
};

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
  let path = location.pathname.replace(/\/+$/, '').toLowerCase();

  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);
  const [currentPath, setCurrentPath] = useState(location.pathname);

  const translate = useLanguage();
  const navigate = useNavigate();

  const items = [
    {
      key: '/',
      icon: <DashboardOutlined />,
      label: <Link to={'/'}>{translate('dashboard')}</Link>,
    },
    {
      key: '/lead',
      icon: <UserAddOutlined />,
      label: <Link to={'/lead'}>{translate('lead')}</Link>,
    },
    {
      key: NAV_LINK_PATTERN['offer'].test(path) ? path : '/offer',
      icon: <FileOutlined />,
      label: <Link to={'/offer'}>{translate('offer')}</Link>,
    },
    {
      key: 'customer',
      icon: <CustomerServiceOutlined />,
      label: <Link to={'/customer'}>{translate('customer')}</Link>,
    },
    // { key: 'order', icon: <ShopOutlined />, label: <Link to={'/'}>Lead</Link> Order },
    // { key: 'inventory', icon: <InboxOutlined />, label: <Link to={'/'}>Lead</Link> Inventory },
    // { key: 'kyc', icon: <ShoppingCartOutlined />, label: <Link to={'/'}>Lead</Link> Kyc },
    {
      key: NAV_LINK_PATTERN['invoice'].test(path) ? path : '/invoice',
      icon: <FileTextOutlined />,
      label: <Link to={'/invoice'}>{translate('invoice')}</Link>,
    },
    {
      key: NAV_LINK_PATTERN['quote'].test(path) ? path : '/quote',
      icon: <FileSyncOutlined />,
      label: <Link to={'/quote'}>{translate('quote')}</Link>,
    },
    {
      key: '/payment',
      icon: <CreditCardOutlined />,
      label: <Link to={'/payment'}>{translate('payment')}</Link>,
    },
    {
      key: '/employee',
      icon: <UserOutlined />,
      label: <Link to={'/employee'}>{translate('employee')}</Link>,
    },
    {
      key: '/admin',
      icon: <TeamOutlined />,
      label: <Link to={'/admin'}>{translate('admin')}</Link>,
    },
    {
      label: translate('Settings'),
      key: 'settings',
      icon: <SettingOutlined />,
      children: [
        {
          key: '/settings',
          label: <Link to={'/settings'}>{translate('general_settings')}</Link>,
        },
        {
          key: '/email',
          label: <Link to={'/email'}>{translate('email_templates')}</Link>,
        },
        {
          key: '/payment/mode',
          label: <Link to={'/payment/mode'}>{translate('payment_mode')}</Link>,
        },
        {
          key: '/taxes',
          label: <Link to={'/taxes'}>{translate('taxes')}</Link>,
        },
        {
          key: '/settings/advanced',
          label: <Link to={'/settings/advanced'}>{translate('advanced_settings')}</Link>,
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
    <Sider
      collapsible={collapsible}
      collapsed={collapsible ? isNavMenuClose : collapsible}
      onCollapse={onCollapse}
      className="navigation"
      style={{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: '20px',
        top: '20px',
        bottom: '20px',
        borderRadius: '8px',
        boxShadow: '0px 0px 20px 3px rgba(150, 190, 238, 0.15)',
      }}
      theme={'light'}
    >
      <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
        <img src={logoIcon} alt="Logo" style={{ height: '32px' }} />

        {!showLogoApp && (
          <img
            src={logoText}
            alt="Logo"
            style={{ marginTop: '3px', marginLeft: '10px', height: '29px' }}
          />
        )}
      </div>
      <Menu selectedKeys={[path === '' ? '/' : path]} items={items} mode="inline" theme={'light'} />
    </Sider>
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
      <Button
        type="text"
        size="large"
        onClick={showDrawer}
        className="mobile-sidebar-btn"
        style={{ marginLeft: 25 }}
      >
        <MenuOutlined style={{ fontSize: 18 }} />
      </Button>
      <Drawer
        width={200}
        placement="left"
        closable={false}
        onClose={onClose}
        open={visible}
        rootClassName="mobile-sidebar-wraper"
      >
        <Sidebar collapsible={false} />
      </Drawer>
    </>
  );
}
