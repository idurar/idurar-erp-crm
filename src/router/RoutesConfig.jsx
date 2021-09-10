import {
  DesktopOutlined,
  SettingOutlined,
  CustomerServiceOutlined,
  FileTextOutlined,
  FileSyncOutlined,
  DashboardOutlined,
  TeamOutlined,
  UserOutlined,
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
    Default: DesktopOutlined,
  };

  const IconTag = components[name || "Default"] || UserOutlined;
  return <IconTag />;
};

export const routesConfig = [
  {
    path: ["/", "/dashboard"],
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
    path: "/admin",
    component: "Admin",
    icon: "TeamOutlined",
  },
];
