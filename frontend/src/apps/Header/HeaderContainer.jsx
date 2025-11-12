"use client"

import { memo } from "react"
import { useSelector } from "react-redux"
import { Link, useNavigate } from "react-router-dom"
import { Avatar, Dropdown, Layout } from "antd"

// import Notifications from '@/components/Notification';

import { LogoutOutlined, ToolOutlined, UserOutlined } from "@ant-design/icons"

import { selectCurrentAdmin } from "@/redux/auth/selectors"

import { FILE_BASE_URL } from "@/config/serverApiConfig"

import useLanguage from "@/locale/useLanguage"

import UpgradeButton from "./UpgradeButton"

const HeaderContent = memo(function HeaderContent() {
  const currentAdmin = useSelector(selectCurrentAdmin)
  const { Header } = Layout

  const translate = useLanguage()

  const ProfileDropdown = () => {
    const navigate = useNavigate()
    return (
      <div className="profileDropdown" onClick={() => navigate("/profile")}>
        <Avatar
          size="large"
          className="last"
          src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
          style={{
            color: "#f56a00",
            backgroundColor: currentAdmin?.photo ? "none" : "#fde3cf",
            boxShadow: "rgba(150, 190, 238, 0.35) 0px 0px 6px 1px",
          }}
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        <div className="profileDropdownInfo">
          <p>
            {currentAdmin?.name} {currentAdmin?.surname}
          </p>
          <p>{currentAdmin?.email}</p>
        </div>
      </div>
    )
  }

  const DropdownMenu = ({ text }) => {
    return <span style={{}}>{text}</span>
  }

  const items = [
    {
      label: <ProfileDropdown className="headerDropDownMenu" />,
      key: "ProfileDropdown",
    },
    {
      type: "divider",
    },
    {
      icon: <UserOutlined />,
      key: "settingProfile",
      label: (
        <Link to={"/profile"}>
          <DropdownMenu text={translate("profile_settings")} />
        </Link>
      ),
    },
    {
      icon: <ToolOutlined />,
      key: "settingApp",
      label: <Link to={"/settings"}>{translate("app_settings")}</Link>,
    },

    {
      type: "divider",
    },

    {
      icon: <LogoutOutlined />,
      key: "logout",
      label: <Link to={"/logout"}>{translate("logout")}</Link>,
    },
  ]

  return (
    <Header
      style={{
        padding: "20px",
        background: "#ffffff",
        display: "flex",
        flexDirection: "row-reverse",
        justifyContent: "flex-start",
        gap: " 15px",
      }}
    >
      <Dropdown
        menu={{
          items,
        }}
        trigger={["click"]}
        placement="bottomRight"
        stye={{ width: "280px", float: "right" }}
      >
        {/* <Badge dot> */}
        <Avatar
          className="last"
          src={currentAdmin?.photo ? FILE_BASE_URL + currentAdmin?.photo : undefined}
          style={{
            color: "#f56a00",
            backgroundColor: currentAdmin?.photo ? "none" : "#fde3cf",
            boxShadow: "rgba(150, 190, 238, 0.35) 0px 0px 10px 2px",
            float: "right",
            cursor: "pointer",
          }}
          size="large"
        >
          {currentAdmin?.name?.charAt(0)?.toUpperCase()}
        </Avatar>
        {/* </Badge> */}
      </Dropdown>

      {/* <AppsButton /> */}

      <UpgradeButton />
    </Header>
  )
})

export default HeaderContent

//  console.log(
//    '🚀 Welcome to IDURAR ERP CRM! Did you know that we also offer commercial customization services? Contact us at hello@idurarapp.com for more information.'
//  );
