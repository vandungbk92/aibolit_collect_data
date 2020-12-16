const PAGINATION_CONFIG_INIT = {
  showSizeChanger: true,
  showTotal: (total, range) => `${range[0]}-${range[1]} của ${total}`,
  size:"small",
};

export const CONSTANTS = {
  TIME_OUT: 60000,

  INPUT: 'INPUT',
  PASSWORD: 'PASSWORD',
  TEXT: 'TEXT',
  NUMBER: 'NUMBER',
  SELECT: 'SELECT',
  MULTI_SELECT: 'MULTI_SELECT',
  DATE: 'DATE',

  TEXT_AREA: 'TEXT_AREA',


  MALE: 'MALE',
  FEMALE: 'FEMALE',
  ALL: 'ALL',
  ADMIN: 'ADMIN',
  MANAGE: 'QUAN_LY',
  DOCTOR: 'BAC_SY',
  ADMINISTRATOR: 'ADMINISTRATOR',

  DOWNLOAD: 'DOWNLOAD',
  PRINT: 'PRINT',
  EXPORT: 'EXPORT',
};


export const RULE = {
  REQUIRED: { required: true, message: 'Không được để trống' },
  NUMBER: {  pattern: '^[0-9]+$', message: 'Không phải là số' },
  PHONE: { pattern: '^[0-9]+$', len: 10, message: 'Số điện thoại không hợp lệ' },
  EMAIL: { type: 'email', message: 'Email không hợp lệ' },
  NUMBER_FLOAT: {
    pattern: new RegExp("^[- +]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$"),
    message: "Không phải là số"
  }
};
export const PAGINATION_CONFIG = Object.assign({}, PAGINATION_CONFIG_INIT)

export const GENDER_OPTIONS = [
  { value: CONSTANTS.MALE, label: 'Nam' },
  { value: CONSTANTS.FEMALE, label: 'Nữ' },
];

export const DISEASE_GENDER_OPTIONS = [
  { value: CONSTANTS.MALE, label: 'Nam' },
  { value: CONSTANTS.FEMALE, label: 'Nữ' },
  { value: CONSTANTS.ALL, label: 'Tất cả' },
];

export const ROLE_OPTIONS = [
  { value: CONSTANTS.ADMIN, label: 'Quản trị hệ thống' },
  { value: CONSTANTS.MANAGE, label: 'Quản lý' },
];
