import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Layout, Menu } from "antd";

import { useAppContext } from "@/context/appContext";
import logoIcon from "@/style/images/logo-icon.png";
import logoText from "@/style/images/logo-text.png";
import { routesConfig, IconMenu } from "@/router/RoutesConfig";

const { Sider } = Layout;
const { SubMenu } = Menu;

export default function Navigation() {
  const { state: stateApp, appContextAction } = useAppContext();
  const { isNavMenuClose } = stateApp;
  const { navMenu } = appContextAction;
  const [showLogoApp, setLogoApp] = useState(isNavMenuClose);

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
    <>
      <Sider
        collapsible
        collapsed={isNavMenuClose}
        onCollapse={onCollapse}
        className="navigation"
      >
        <div className="logo">
          <img
            src={logoIcon}
            alt="Logo"
            // style={{ margin: "0 auto 40px", display: "block" }}
          />

          {!showLogoApp && (
            <img
              src={logoText}
              alt="Logo"
              style={{ marginTop: "3px", marginLeft: "10px" }}
            />
          )}
        </div>
        <Menu mode="inline">
          {routesConfig.map((routeItem) => {
            return (
              <Menu.Item
                key={routeItem.component}
                icon={<IconMenu name={routeItem.icon} />}
              >
                <Link to={routeItem.path} />
                {routeItem.component}
              </Menu.Item>
            );
          })}
        </Menu>
      </Sider>
    </>
  );
}
