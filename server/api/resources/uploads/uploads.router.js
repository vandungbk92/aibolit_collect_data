import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import uploadsController from './uploads.controller';
import passport from 'passport';

export const uploadsRouter = express.Router();

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    const savePath = path.resolve(__dirname, `../../../uploads/${req.params.id}`);
    if (!fs.existsSync(savePath)) {
      fs.mkdir(savePath, { recursive: true }, err => {
      });
    }
    cb(null, savePath);
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString().replace(/:/g, '-') + '_' + file.originalname);
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 500 * 1024 * 1024,
  },
  fileFilter: function(req, file, cb) {
    const filetypes = /mp4|3gpp|x-msvideo|x-ms-wmv|x-flv|quicktime|webm|ogg|avi|mov|jpg|png|jpeg|gif|JPG|PNG|JPEG|wav|mpeg|mp3|basic|x-mpegurl|x-m4a|m4a/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) {
      return cb(null, true);
    }
    return cb(null, false);
  },
});

uploadsRouter
  .post('/:id', upload.fields(
    [{ name: 'files' }]
    ), uploadsController.uploadFiles);



