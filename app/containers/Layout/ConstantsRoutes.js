import React from "react";
import { HomeOutlined } from "@ant-design/icons";

import { URL } from "@url";
import { CONSTANTS } from "@constants";

import HomePage from "../Pages/HomePage/Loadable";
import Profile from "../Pages/Profile/Loadable";
import NotFoundPage from "../Pages/NotFoundPage/Loadable";

function renderMenuIcon(icon) {
  return (
    <span className="anticon m-0" style={{ transform: "translateY(-2px)" }}>
      <i className={`fa ${icon} menu-icon`} aria-hidden="true" />
    </span>
  );
}

const constantsRoutes = [
  {
    path: URL.HOMEPAGE,
    menuName: "Trang chủ",
    component: HomePage,
    icon: <HomeOutlined />,
    exact: true,
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE]
  },
  {
    path: URL.PROFILE,
    breadcrumbName: "Hồ sơ cá nhân",
    component: Profile,
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE]
  },
  {
    path: URL.NOT_FOUND,
    component: NotFoundPage,
    role: []
  }
];

export default constantsRoutes;
