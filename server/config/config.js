const config = {
  production: {
    secret: process.env.secret,
    MONGO_URI: 'mongodb://root:thinK36lAbs@mongo:27017/hssk?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
    port: process.env.PORT,
    "mail": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secure": false,
      "auth": {
        "user": "vandungbk92@gmail.com",
        "pass": "dung9255"
      }
    },
    host_admin: 'http://161.202.27.51:8002'
  },
  development: {
    secret: 'ho_so_suc_khoe',
    MONGO_URI: 'mongodb://root:thinK36lAbs@161.202.27.51:27017/hssk?authSource=admin&readPreference=primary&appname=MongoDB%20Compass&ssl=false',
    port: 37922,
    "mail": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secure": false,
      "auth": {
        "user": "vandungbk92@gmail.com",
        "pass": "dung9255"
      }
    },
    host_admin: 'http://161.202.27.51:8002'
  },
};

export const getConfig = env => config[env] || config.development;
