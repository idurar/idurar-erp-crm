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
    path: "/currency",
    component: "Currency",
    icon: "DesktopOutlined",
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
    component: "PaymentClient",
    title: "Payment Client",
    icon: "CreditCardOutlined",
  },
  {
    path: "/payment/mode",
    component: "PaymentMode",
    title: "Payment Mode",
    icon: "CreditCardOutlined",
  },
  {
    path: "/admin",
    component: "Admin",
    icon: "TeamOutlined",
  },
];
