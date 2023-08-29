import React from 'react';
// import {
//   DesktopOutlined,
//   SettingOutlined,
//   CustomerServiceOutlined,
//   FileTextOutlined,
//   FileSyncOutlined,
//   DashboardOutlined,
//   TeamOutlined,
//   UserOutlined,
//   CreditCardOutlined,
//   BankOutlined,
// } from "@ant-design/icons";

// export const IconMenu = ({ name }) => {
//   const components = {
//     DesktopOutlined: DesktopOutlined,
//     SettingOutlined: SettingOutlined,
//     CustomerServiceOutlined: CustomerServiceOutlined,
//     FileTextOutlined: FileTextOutlined,
//     FileSyncOutlined: FileSyncOutlined,
//     DashboardOutlined: DashboardOutlined,
//     TeamOutlined: TeamOutlined,
//     UserOutlined: UserOutlined,
//     CreditCardOutlined: CreditCardOutlined,
//     BankOutlined: BankOutlined,
//     Default: DesktopOutlined,
//   };

//   const IconTag = components[name || "Default"] || SettingOutlined;
//   return <IconTag />;
// };

export const routesConfig = [
  {
    path: '/',
    component: 'Dashboard',
  },
  {
    path: '/customer',
    component: 'Customer',
  },
  {
    path: '/invoice',
    component: 'Invoice/index',
  },
  {
    path: '/invoice/create',
    component: 'Invoice/InvoiceCreate',
  },
  {
    path: '/invoice/read/:id',
    component: 'Invoice/InvoiceRead',
  },
  {
    path: '/invoice/update/:id',
    component: 'Invoice/InvoiceUpdate',
  },
  {
    path: '/quote',
    component: 'Quote/index',
  },
  {
    path: '/quote/create',
    component: 'Quote/QuoteCreate',
  },
  {
    path: '/quote/read/:id',
    component: 'Quote/QuoteRead',
  },
  {
    path: '/quote/update/:id',
    component: 'Quote/QuoteUpdate',
  },
  {
    path: '/payment/invoice',
    component: 'PaymentInvoice',
  },
  {
    path: '/employee',
    component: 'Employee',
  },
  {
    path: '/admin',
    component: 'Admin',
  },
  {
    path: '/settings',
    component: 'Settings/Settings',
  },
  {
    path: '/payment/mode',
    component: 'PaymentMode',
  },
  {
    path: '/role',
    component: 'Role',
  },
  {
    path: '/profile',
    component: 'Profile',
  },
];
