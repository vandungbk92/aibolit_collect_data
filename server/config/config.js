const DEFAULT_DB_URI = "mongodb://thuthapdulieu:thuthapdulieu@118.70.156.51:4014/thuthapdulieu?authSource=thuthapdulieu";
const config = {
  production: {
    secret: 'AIBOLIT',
    MONGO_URI: process.env.MONGO_URI || DEFAULT_DB_URI,
    port: process.env.PORT,
    "cos": {
      "credentials": {
        "serviceInstanceId": "crn:v1:bluemix:public:cloud-object-storage:global:a/c8892a299ea04a629bf4ed7f5ed8a5b1:cbf00124-96fd-48d5-be8f-f195a70420b2::",
        "endpoint": "https://s3.ap.cloud-object-storage.appdomain.cloud",
        "apiKeyId": "rki429NHwsuGE2zwKLWdgDUoJvK7EJtrpdrXCG0-wPSV",
        "ibmAuthEndpoint": "https://iam.ng.bluemix.net/oidc/token",
      },
      "bucketName": "aibolit-collect"
    },
    "mail": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secure": false,
      "auth": {
        "user": "manager.tradar@gmail.com",
        "pass": "thinklabs@36"
      }
    },
    host_admin: 'https://data.thinklabs.com.vn',
    mail_mailgun: {
      "auth": {
        "api_key": "e1d4c20fa30e05a4cbc5c9435dc598f6-b892f62e-5d7832d3",
        "domain": "sandboxd48b21c0aea74e508097ca22c1ac3ad7.mailgun.org"
      }
    }
  },
  development: {
    secret: 'AIBOLIT',
    MONGO_URI: 'mongodb://thuthapdulieu:thuthapdulieu@113.160.181.249:4014/thuthapdulieu?authSource=thuthapdulieu',
    port: 27017,
    "cos": {
      "credentials": {
        "serviceInstanceId": "crn:v1:bluemix:public:cloud-object-storage:global:a/c8892a299ea04a629bf4ed7f5ed8a5b1:cbf00124-96fd-48d5-be8f-f195a70420b2::",
        "endpoint": "https://s3.ap.cloud-object-storage.appdomain.cloud",
        "apiKeyId": "rki429NHwsuGE2zwKLWdgDUoJvK7EJtrpdrXCG0-wPSV",
        "ibmAuthEndpoint": "https://iam.ng.bluemix.net/oidc/token",
      },
      "bucketName": "aibolit-collect"
    },
    "mail": {
      "host": "smtp.gmail.com",
      "port": 587,
      "secure": false,
      "auth": {
        "user": "manager.tradar@gmail.com",
        "pass": "thinklabs@36"
      }
    },
    host_admin: 'http://localhost:8080',
    mail_mailgun: {
      "auth": {
        "api_key": "22c6ee1fde1b7cbc0b360ef9a8c7d6da-4836d8f5-76b43d5c",
        "domain": "thinklabs.vn"
      }
    }
  },
};

export const getConfig = env => config[env] || config.development;
