import fs from 'fs';
import * as AWS from 'ibm-cos-sdk';
import uuidV4 from 'uuid';
import multipart from 'connect-multiparty';
import path from 'path';
import { getConfig } from '../../config/config';
import request from 'request'

const osTempDir = require('os').tmpdir();
const tempDir = osTempDir + '/uploads';

if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir);
}

const config = getConfig(process.env.NODE_ENV);
const multipartMiddleware = multipart({uploadDir: tempDir});

const checkTempFolder = (req, res, next)=>{
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  next();
};

const prepareTempFolder = () => {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }
  clearFolder(tempDir);
};

const clearFolder = (tempDir) => {
  fs.readdir(tempDir, (err, files) => {
    if (err) {
      console.log(err);
      return;
    }
    for (const file of files) {
      fs.unlink(path.join(tempDir, file), err => {
        if (err) {
          console.log(file, err);
        }
      });
    }
  });
};

const getFileExtension = (filename) => {
  let ext = /^.+\.([^.]+)$/.exec(filename);
  return ext === null ? '' : ext[1];
};

function getFileName(path) {
  let fileName;
  if (path) {
    let fileExtension = getFileExtension(path);
    fileName = fileExtension === '' ? uuidV4() : uuidV4() + '.' + fileExtension;
  }
  return fileName;
}

async function downLoadAndSaveFile(pathUrl, file_name, fileStorage) {
  if (!fs.existsSync(tempDir)) {
    fs.mkdirSync(tempDir);
  }

  request(pathUrl).pipe(fs.createWriteStream(tempDir + '/' + file_name)).on('close', async function () {
    await createByName(tempDir + '/' + file_name, fileStorage)
  });
}

function formatFileName(str) {
  if (!str) return;
  str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str.replace(/đ/g, 'd');
  str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str.replace(/Đ/g, 'D');
  str = str.replace(/\s+/g, '_');
  return str;
}

function convertFileName(fileNm) {
  let extension = path.extname(fileNm);
  let fileWithoutExtension = formatFileName(path.basename(fileNm, extension));
  let date_val = new Date();
  let timestam = date_val.getTime();
  let fileStorage = fileWithoutExtension + '_' + timestam + extension;
  return fileStorage
}

export {
  multipartMiddleware,
  getFileExtension,
  prepareTempFolder,
  getFileName,
  checkTempFolder,
  downLoadAndSaveFile,
  formatFileName,
  convertFileName
};
