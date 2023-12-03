import { lazy } from 'react';

import { useRoutes } from 'react-router-dom';
import PublicRoute from './PublicRoute';
import AccessRestrictedRoute from './AccessRestrictedRoute';
import { accessTypes } from '@/utils/constants';

const Logout = lazy(() => import('@/pages/Logout.jsx'));
const NotFound = lazy(() => import('@/pages/NotFound.jsx'));

const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Customer = lazy(() => import('@/pages/Customer'));
const Inventory = lazy(() => import('@/pages/Inventory'));
const Order = lazy(() => import('@/pages/Order'));
const Invoice = lazy(() => import('@/pages/Invoice'));
const InvoiceCreate = lazy(() => import('@/pages/Invoice/InvoiceCreate'));

const InvoiceRead = lazy(() => import('@/pages/Invoice/InvoiceRead'));
const InvoiceUpdate = lazy(() => import('@/pages/Invoice/InvoiceUpdate'));
const InvoiceRecordPayment = lazy(() => import('@/pages/Invoice/InvoiceRecordPayment'));
const Quote = lazy(() => import('@/pages/Quote/index'));
const QuoteCreate = lazy(() => import('@/pages/Quote/QuoteCreate'));
const QuoteRead = lazy(() => import('@/pages/Quote/QuoteRead'));
const QuoteUpdate = lazy(() => import('@/pages/Quote/QuoteUpdate'));
const Payment = lazy(() => import('@/pages/Payment/index'));
const PaymentRead = lazy(() => import('@/pages/Payment/PaymentRead'));
const PaymentUpdate = lazy(() => import('@/pages/Payment/PaymentUpdate'));
const Employee = lazy(() => import('@/pages/Employee'));
const Admin = lazy(() => import('@/pages/Admin'));
const Settings = lazy(() => import('@/pages/Settings/Settings'));
const PaymentMode = lazy(() => import('@/pages/PaymentMode'));
const Taxes = lazy(() => import('@/pages/Taxes'));
const Email = lazy(() => import('@/pages/Email/index'));
const EmailRead = lazy(() => import('@/pages/Email/EmailRead'));
const EmailUpdate = lazy(() => import('@/pages/Email/EmailUpdate'));
const AdvancedSettings = lazy(() => import('@/pages/AdvancedSettings'));
const Profile = lazy(() => import('@/pages/Profile'));
const Lead = lazy(() => import('@/pages/Lead/index'));
const Offer = lazy(() => import('@/pages/Offer/index'));
const OfferCreate = lazy(() => import('@/pages/Offer/OfferCreate'));
const OfferRead = lazy(() => import('@/pages/Offer/OfferRead'));
const OfferUpdate = lazy(() => import('@/pages/Offer/OfferUpdate'));

export default function AppRouter() {
  const getAccessRestrictedRoute = (el, type = accessTypes.EDIT) => (
    <AccessRestrictedRoute type={type}>{el}</AccessRestrictedRoute>
  );

  let element = useRoutes([
    {
      path: '/login',
      element: <PublicRoute />,
    },
    {
      path: '/logout',
      element: <Logout />,
    },
    {
      path: '/',
      element: <Dashboard />,
    },
    {
      path: '/customer',
      element: <Customer />,
    },
    {
      path: '/inventory',
      element: <Inventory />,
    },
    {
      path: '/order',
      element: <Order />,
    },
    {
      path: '/invoice',
      element: <Invoice />,
    },
    {
      path: '/invoice/create',
      element: getAccessRestrictedRoute(<InvoiceCreate />, accessTypes.CREATE),
    },
    {
      path: '/invoice/read/:id',
      element: <InvoiceRead />,
    },
    {
      path: '/invoice/update/:id',
      element: getAccessRestrictedRoute(<InvoiceUpdate />, accessTypes.EDIT),
    },
    {
      path: '/invoice/pay/:id',
      element: getAccessRestrictedRoute(<InvoiceRecordPayment />, accessTypes.EDIT),
    },
    {
      path: '/quote',
      element: <Quote />,
    },
    {
      path: '/quote/create',
      element: getAccessRestrictedRoute(<QuoteCreate />, accessTypes.CREATE),
    },
    {
      path: '/quote/read/:id',
      element: <QuoteRead />,
    },
    {
      path: '/quote/update/:id',
      element: getAccessRestrictedRoute(<QuoteUpdate />, accessTypes.EDIT),
    },
    {
      path: '/payment',
      element: <Payment />,
    },
    {
      path: '/payment/read/:id',
      element: <PaymentRead />,
    },
    {
      path: '/payment/update/:id',
      element: getAccessRestrictedRoute(<PaymentUpdate />, accessTypes.EDIT),
    },
    {
      path: '/employee',
      element: <Employee />,
    },
    {
      path: '/admin',
      element: <Admin />,
    },
    {
      path: '/settings',
      element: <Settings />,
    },
    {
      path: '/payment/mode',
      element: <PaymentMode />,
    },
    {
      path: '/taxes',
      element: <Taxes />,
    },
    {
      path: '/email',
      element: <Email />,
    },
    {
      path: '/email/read/:id',
      element: <EmailRead />,
    },
    {
      path: '/email/update/:id',
      element: getAccessRestrictedRoute(<EmailUpdate />, accessTypes.EDIT),
    },
    {
      path: '/settings/advanced',
      element: <AdvancedSettings />,
    },
    {
      path: '/profile',
      element: <Profile />,
    },
    {
      path: '/lead',
      element: <Lead />,
    },
    {
      path: '/offer',
      element: <Offer />,
    },
    {
      path: '/offer/create',
      element: getAccessRestrictedRoute(<OfferCreate />, accessTypes.CREATE),
    },
    {
      path: '/offer/read/:id',
      element: <OfferRead />,
    },
    {
      path: '/offer/update/:id',
      element: getAccessRestrictedRoute(<OfferUpdate />, accessTypes.EDIT),
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return element;
}
