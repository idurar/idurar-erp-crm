import { lazy } from 'react';

import { Navigate } from 'react-router-dom';

const Logout = lazy(() => import('@/pages/Logout.jsx'));
const NotFound = lazy(() => import('@/pages/NotFound.jsx'));
const Dashboard = lazy(() => import('@/pages/Dashboard.jsx'));


const Customer = lazy(() => import('@/pages/Customer'));
const Invoice = lazy(() => import('@/pages/Invoice'));
const InvoiceCreate = lazy(() => import('@/pages/Invoice/InvoiceCreate'));

const InvoiceRead = lazy(() => import('@/pages/Invoice/InvoiceRead'));
const InvoiceUpdate = lazy(() => import('@/pages/Invoice/InvoiceUpdate'));
const InvoiceRecordPayment = lazy(() => import('@/pages/Invoice/InvoiceRecordPayment'));

const Quote = lazy(() => import('@/pages/Quote'));
const QuoteCreate = lazy(() => import('@/pages/Quote/QuoteCreate'));
const QuoteRead = lazy(() => import('@/pages/Quote/QuoteRead'));
const QuoteUpdate = lazy(() => import('@/pages/Quote/QuoteUpdate'));

const Payment = lazy(() => import('@/pages/Payment/index'));
const PaymentRead = lazy(() => import('@/pages/Payment/PaymentRead'));
const PaymentUpdate = lazy(() => import('@/pages/Payment/PaymentUpdate'));
const PaymentMode = lazy(() => import('@/pages/PaymentMode'));
const Taxes = lazy(() => import('@/pages/Taxes'));

const Settings = lazy(() => import('@/pages/Settings/Settings'));
const Inventory = lazy(() => import('@/pages/Inventory'));
const InventoryCategories = lazy(() => import('@/pages/InventoryCategories'));
const Users = lazy(() => import('@/pages/Users'));
const TimeEntries = lazy(() => import('@/pages/TimeEntries'));
const Employees = lazy(() => import('@/pages/Employees'));
const Suppliers = lazy(() => import('@/pages/Suppliers'));
const PurchaseOrders = lazy(() => import('@/pages/PurchaseOrders'));
const OrderConfirmations = lazy(() => import('@/pages/OrderConfirmations'));
const Expenses = lazy(() => import('@/pages/Expenses'));
const ExpenseCategories = lazy(() => import('@/pages/ExpenseCategories'));
const GoodsReceipts = lazy(() => import('@/pages/GoodsReceipts'));


const Profile = lazy(() => import('@/pages/Profile'));

const About = lazy(() => import('@/pages/About'));

let routes = {
  expense: [],
  default: [
    {
      path: '/login',
      element: <Navigate to="/" />,
    },
    {
      path: '/logout',
      element: <Logout />,
    },
    {
      path: '/about',
      element: <Navigate to="/support" replace />,
    },
    {
      path: '/support',
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
      path: '/inventory',
      element: <Inventory />,
    },
    {
      path: '/inventory/categories',
      element: <InventoryCategories />,
    },
    {
      path: '/time-entries',
      element: <TimeEntries />,
    },
    {
      path: '/time-entries/employees',
      element: <Employees />,
    },
    {
      path: '/suppliers',
      element: <Suppliers />,
    },
    {
      path: '/purchase-orders',
      element: <PurchaseOrders />,
    },
    {
      path: '/order-confirmations',
      element: <OrderConfirmations />,
    },
    {
      path: '/goods-receipts',
      element: <GoodsReceipts />,
    },
    {
      path: '/expenses',
      element: <Expenses />,
    },
    {
      path: '/expenses/categories',
      element: <ExpenseCategories />,
    },
    {
      path: '/settings',
      element: <Settings />,
    },
    {
      path: '/users',
      element: <Users />,
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
      path: '/profile',
      element: <Profile />,
    },
    {
      path: '*',
      element: <NotFound />,
    },
  ],
};

export default routes;
