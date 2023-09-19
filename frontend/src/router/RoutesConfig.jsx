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
    path: '/invoice/pay/:id',
    component: 'Invoice/InvoiceRecordPayment',
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
    component: 'PaymentInvoice/index',
  },
  {
    path: '/payment/invoice/create',
    component: 'PaymentInvoice/PaymentInvoiceCreate',
  },
  {
    path: '/payment/invoice/read/:id',
    component: 'PaymentInvoice/PaymentInvoiceRead',
  },
  {
    path: '/payment/invoice/update/:id',
    component: 'PaymentInvoice/PaymentInvoiceUpdate',
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
    path: '/email',
    component: 'Email/index',
  },
  {
    path: '/email/read/:id',
    component: 'Email/EmailRead',
  },
  {
    path: '/email/update/:id',
    component: 'Email/EmailUpdate',
  },
  {
    path: '/settings/advanced',
    component: 'AdvancedSettings',
  },
  {
    path: '/profile',
    component: 'Profile',
  },
  {
    path: '/lead',
    component: 'Lead/index',
  },
  {
    path: '/lead/create',
    component: 'Lead/LeadCreate',
  },
  {
    path: '/lead/read/:id',
    component: 'Lead/LeadRead',
  },
  {
    path: '/lead/update/:id',
    component: 'Lead/LeadUpdate',
  },
  {
    path: '/offer',
    component: 'Offer/index',
  },
  {
    path: '/offer/create',
    component: 'Offer/OfferCreate',
  },
  {
    path: '/offer/read/:id',
    component: 'Offer/OfferRead',
  },
  {
    path: '/offer/update/:id',
    component: 'Offer/OfferUpdate',
  },
];
