import { lazy } from 'react';

import { useRoutes } from 'react-router-dom';
import { Navigate } from 'react-router-dom';

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

const ExpenseCategory = lazy(() => import('@/pages/ExpenseCategory'));
const Expense = lazy(() => import('@/pages/Expense'));
const ProductCategory = lazy(() => import('@/pages/ProductCategory'));
const Product = lazy(() => import('@/pages/Product'));

const People = lazy(() => import('@/pages/People'));
const Company = lazy(() => import('@/pages/Company'));

const About = lazy(() => import('@/pages/About'));
const Verify = lazy(() => import('@/pages/Verify'));

export default function AppRouter() {
  let element = useRoutes([
    {
      path: '/login',
      element: <Navigate to="/" />,
    },
    {
      path: '/verify/*',
      element: <Verify />,
    },
    {
      path: '/resetpassword/*',
      element: <Navigate to="/" />,
    },
    {
      path: '/logout',
      element: <Logout />,
    },
    {
      path: '/about',
      element: <About />,
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
      path: '/people',
      element: <People />,
    },
    {
      path: '/company',
      element: <Company />,
    },
    {
      path: '/expenses',
      element: <Expense />,
    },
    {
      path: '/product',
      element: <Product />,
    },
    {
      path: '/category/product',
      element: <ProductCategory />,
    },
    {
      path: 'category/expenses',
      element: <ExpenseCategory />,
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
      element: <InvoiceCreate />,
    },
    {
      path: '/invoice/read/:id',
      element: <InvoiceRead />,
    },
    {
      path: '/invoice/update/:id',
      element: <InvoiceUpdate />,
    },
    {
      path: '/invoice/pay/:id',
      element: <InvoiceRecordPayment />,
    },
    {
      path: '/quote',
      element: <Quote />,
    },
    {
      path: '/quote/create',
      element: <QuoteCreate />,
    },
    {
      path: '/quote/read/:id',
      element: <QuoteRead />,
    },
    {
      path: '/quote/update/:id',
      element: <QuoteUpdate />,
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
      element: <PaymentUpdate />,
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
      path: '/settings/edit/:settingsKey',
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
      element: <EmailUpdate />,
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
      element: <OfferCreate />,
    },
    {
      path: '/offer/read/:id',
      element: <OfferRead />,
    },
    {
      path: '/offer/update/:id',
      element: <OfferUpdate />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ]);

  return element;
}
