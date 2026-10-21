import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Button, Drawer, Layout, Menu } from 'antd';

import { useAppContext } from '@/context/appContext';

import useLanguage from '@/locale/useLanguage';
import logo from '@/style/images/wiepilot-logo.png';

import useResponsive from '@/hooks/useResponsive';

import {
  SettingOutlined,
  TeamOutlined,
  ContainerOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  CreditCardOutlined,
  MenuOutlined,
  ShopOutlined,
  WalletOutlined,
  ReconciliationOutlined,
  InboxOutlined,
  UserSwitchOutlined,
  ClockCircleOutlined,
  ShoppingCartOutlined,
  BankOutlined,
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import { selectCurrentAdmin } from '@/redux/auth/selectors';

const { Sider } = Layout;

export default function Navigation() {
  const { isMobile } = useResponsive();

  return isMobile ? <MobileSidebar /> : <Sidebar collapsible={false} />;
}

function Sidebar({ collapsible, isMobile = false, onNavigate }) {
  let location = useLocation();

  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);
  const [currentPath, setCurrentPath] = useState(location.pathname === '/' ? 'dashboard' : location.pathname.slice(1));

  const translate = useLanguage();
  const navigate = useNavigate();
  const currentAdmin = useSelector(selectCurrentAdmin);

  const canManageOperations = ['owner', 'admin', 'accounting', 'warehouse'].includes(currentAdmin?.role);
  const isAdministrator = ['owner', 'admin'].includes(currentAdmin?.role);
  const items = [
    {
      type: 'group',
      key: 'start-group',
      label: 'Start',
      children: [{ key: 'dashboard', icon: <DashboardOutlined />, label: <Link to={'/'}>{translate('dashboard')}</Link> }],
    },
    {
      type: 'group',
      key: 'sales-group',
      label: 'Verkauf',
      children: [
        { key: 'customer', icon: <TeamOutlined />, label: <Link to={'/customer'}>{translate('customers')}</Link> },
        { key: 'quote', icon: <FileSyncOutlined />, label: <Link to={'/quote'}>{translate('offers')}</Link> },
        { key: 'order-confirmations', icon: <ReconciliationOutlined />, label: <Link to={'/order-confirmations'}>Auftragsbestätigungen</Link> },
        { key: 'invoice', icon: <ContainerOutlined />, label: <Link to={'/invoice'}>{translate('invoices')}</Link> },
        { key: 'payment', icon: <CreditCardOutlined />, label: <Link to={'/payment'}>{translate('payments')}</Link> },
      ],
    },
    {
      type: 'group',
      key: 'operations-group',
      label: 'Betrieb',
      children: [
        {
          key: 'time-group',
          icon: <ClockCircleOutlined />,
          label: 'Zeiterfassung',
          children: [
            { key: 'time-entries', label: <Link to={'/time-entries'}>Zeiten & Kontrolle</Link> },
            ...(isAdministrator ? [{ key: 'time-entries/employees', label: <Link to={'/time-entries/employees'}>Mitarbeiter verwalten</Link> }] : []),
          ],
        },
        ...(canManageOperations ? [{
          key: 'purchasing-group',
          icon: <ShoppingCartOutlined />,
          label: 'Einkauf',
          children: [
            { key: 'suppliers', label: <Link to={'/suppliers'}>Lieferanten</Link> },
            { key: 'purchase-orders', label: <Link to={'/purchase-orders'}>Bestellungen</Link> },
            { key: 'goods-receipts', label: <Link to={'/goods-receipts'}>Wareneingänge</Link> },
          ],
        }] : []),
        ...(currentAdmin?.role !== 'accounting' ? [{
          key: 'inventory-group',
          icon: <InboxOutlined />,
          label: 'Lager',
          children: [
            { key: 'inventory', label: <Link to={'/inventory'}>Artikel & Bestand</Link> },
            { key: 'inventory/categories', label: <Link to={'/inventory/categories'}>Kategorien</Link> },
          ],
        }] : []),
        ...(canManageOperations ? [{
          key: 'expense-group',
          icon: <BankOutlined />,
          label: 'Ausgaben',
          children: [
            { key: 'expenses', label: <Link to={'/expenses'}>Ausgabenliste</Link> },
            { key: 'expenses/categories', label: <Link to={'/expenses/categories'}>Kategorien</Link> },
          ],
        }] : []),
      ],
    },
    {
      type: 'group',
      key: 'admin-group',
      label: 'Verwaltung',
      children: [
        { key: 'paymentMode', label: <Link to={'/payment/mode'}>{translate('payments_mode')}</Link>, icon: <WalletOutlined /> },
        { key: 'taxes', label: <Link to={'/taxes'}>{translate('taxes')}</Link>, icon: <ShopOutlined /> },
        { key: 'generalSettings', label: <Link to={'/settings'}>{translate('settings')}</Link>, icon: <SettingOutlined /> },
        ...(isAdministrator ? [{ key: 'users', label: <Link to={'/users'}>Benutzer & Rollen</Link>, icon: <UserSwitchOutlined /> }] : []),
      ],
    },
    {
      type: 'group',
      key: 'help-group',
      label: 'Hilfe',
      children: [{ key: 'support', label: <Link to={'/support'}>{translate('support')}</Link>, icon: <ReconciliationOutlined /> }],
    },
  ];

  useEffect(() => {
    if (location)
      if (currentPath !== location.pathname) {
        if (location.pathname === '/') {
          setCurrentPath('dashboard');
        } else setCurrentPath(location.pathname.slice(1));
      }
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
      width={256}
      style={{
        overflow: 'auto',
        height: '100vh',

        position: isMobile ? 'absolute' : 'relative',
        bottom: '20px',
        ...(!isMobile && {
          // border: 'none',
          ['left']: '20px',
          top: '20px',
          // borderRadius: '8px',
        }),
      }}
      theme="light"
    >
      <div
        className="logo"
        onClick={() => navigate('/')}
        style={{
          cursor: 'pointer',
          width: showLogoApp ? '38px' : '190px',
          height: showLogoApp ? '38px' : '58px',
          justifyContent: 'flex-start',
          alignItems: 'center',
        }}
      >
        <img
          src={logo}
          alt="WIEpilot"
          style={{
            width: showLogoApp ? '38px' : '190px',
            height: showLogoApp ? '38px' : '58px',
            objectFit: 'contain',
            objectPosition: 'left center',
          }}
        />
      </div>
      <Menu
        items={items}
        mode="inline"
        defaultOpenKeys={[
          ...(currentPath.startsWith('time-entries') ? ['time-group'] : []),
          ...(['suppliers', 'purchase-orders', 'goods-receipts'].includes(currentPath) ? ['purchasing-group'] : []),
          ...(currentPath.startsWith('inventory') ? ['inventory-group'] : []),
          ...(currentPath.startsWith('expenses') ? ['expense-group'] : []),
        ]}
        onClick={() => onNavigate?.()}
        theme="light"
        selectedKeys={[currentPath]}
        style={{
          width: 256,
        }}
      />
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
        style={{ ['marginLeft']: 25 }}
      >
        <MenuOutlined style={{ fontSize: 18 }} />
      </Button>
      <Drawer
        width={250}
        // style={{ backgroundColor: 'rgba(255, 255, 255, 1)' }}
        placement={'left'}
        closable={false}
        onClose={onClose}
        open={visible}
      >
        <Sidebar collapsible={false} isMobile={true} onNavigate={onClose} />
      </Drawer>
    </>
  );
}
