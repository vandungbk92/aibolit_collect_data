import React from "react";
import {
  HomeOutlined,
  InsertRowLeftOutlined,
  WeiboCircleOutlined,
  UserOutlined,
  UsergroupDeleteOutlined,
  MedicineBoxOutlined,
  AreaChartOutlined,
  DollarOutlined,
  SisternodeOutlined,
  OneToOneOutlined,
  DollarCircleFilled,
  HistoryOutlined,
  CloudSyncOutlined,
  ImportOutlined,
  ExportOutlined,
} from '@ant-design/icons';

import { URL } from "@url";
import { CONSTANTS } from "@constants";

import HomePage from "../Pages/HomePage/Loadable";
import Profile from "../Pages/Profile/Loadable";
import NotFoundPage from "../Pages/NotFoundPage/Loadable";

import TinhThanh from '@containers/Pages/DanhMuc/TinhThanh/Loadable';
import QuanHuyen from '@containers/Pages/DanhMuc/QuanHuyen/Loadable';
import PhuongXa from '@containers/Pages/DanhMuc/PhuongXa/Loadable';
import TaiKhoan from '@containers/Pages/TaiKhoan/Loadable';
import TrieuTrung from '@containers/Pages/DanhMuc/TrieuTrung/Loadable';
import Benh from '@containers/Pages/DanhMuc/Benh/Loadable';
import NoiSoiTai from '@containers/Pages/NoiSoiTai/Loadable';
import NoiSoiTaiChiTiet from '@containers/Pages/NoiSoiTai/ChiTiet/Loadable';

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
  },
  {
    path: '/noi-soi-tai',
    menuName: 'Nội soi tai',
    component: NoiSoiTai,
    icon: <WeiboCircleOutlined/>,
    exact: true,
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE]
  },
  {
    path: '/noi-soi-tai/add',
    component: NoiSoiTaiChiTiet,
    icon: <WeiboCircleOutlined/>,
    exact: true,
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE]
  },
  {
    path: '/noi-soi-tai/:id',
    component: NoiSoiTaiChiTiet,
    breadcrumbName: 'Thêm dữ liệu',
    icon: <WeiboCircleOutlined/>,
    exact: true,
    role: [CONSTANTS.ADMIN, CONSTANTS.MANAGE]
  },
  {
    path: URL.TAI_KHOAN,
    menuName: 'Quản lý tài khoản',
    component: TaiKhoan,
    icon: renderMenuIcon('fa-user-md'),
    exact: true,
    role: [CONSTANTS.ADMIN]
  },
  {
    path: URL.CATEGORY,
    breadcrumbName: 'Danh mục chung',
    menuName: 'Danh mục chung',
    icon: <InsertRowLeftOutlined/>,
    children: [
      { path: URL.TRIEU_CHUNG, menuName: 'Triệu chứng', component: TrieuTrung, role: [CONSTANTS.ADMIN] },
      { path: URL.BENH, menuName: 'Bệnh', component: Benh, role: [CONSTANTS.ADMIN] },
      { path: URL.TINH_THANH, menuName: 'Tỉnh thành', component: TinhThanh, role: [CONSTANTS.ADMIN] },
      { path: URL.QUAN_HUYEN, menuName: 'Quận huyện', component: QuanHuyen, role: [CONSTANTS.ADMIN] },
      { path: URL.PHUONG_XA, menuName: 'Phường xã', component: PhuongXa, role: [CONSTANTS.ADMIN] },
    ],
    role: [CONSTANTS.ADMIN]
  },
];

export default constantsRoutes;
