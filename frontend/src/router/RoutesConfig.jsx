import React from "react";
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
} from "@ant-design/icons";

export const IconMenu = ({ name }) => {
  const components = {
    DesktopOutlined: DesktopOutlined,
    SettingOutlined: SettingOutlined,
    CustomerServiceOutlined: CustomerServiceOutlined,
    FileTextOutlined: FileTextOutlined,
    FileSyncOutlined: FileSyncOutlined,
    DashboardOutlined: DashboardOutlined,
    TeamOutlined: TeamOutlined,
    UserOutlined: UserOutlined,
    CreditCardOutlined: CreditCardOutlined,
    Default: DesktopOutlined,
  };

  const IconTag = components[name || "Default"] || SettingOutlined;
  return <IconTag />;
};

export const routesConfig = [
  {
    path: "/",
    component: "Dashboard",
    icon: "DashboardOutlined",
  },
  {
    path: "/customer",
    component: "Customer",
    icon: "CustomerServiceOutlined",
  },
  {
    path: "/invoice",
    component: "Invoice",
    icon: "FileTextOutlined",
  },
  {
    path: "/quote",
    component: "Quote",
    icon: "FileSyncOutlined",
  },
  {
    path: "/payment/client",
    component: "PaymentInvoice",
    title: "Payment Client",
    icon: "CreditCardOutlined",
  },
  {
    path: "/payment/mode",
    component: "PaymentMode",
    title: "Payment Mode",
    icon: "BankOutlined",
  },
  {
    path: "/employee",
    component: "Employee",
    icon: "UserOutlined",
  },
  {
    path: "/admin",
    component: "Admin",
    icon: "TeamOutlined",
  },
  {
    path: "/role",
    component: "Role",
    icon: "SettingOutlined",
  },
];
