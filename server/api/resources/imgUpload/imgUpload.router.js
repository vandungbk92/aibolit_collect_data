import express from 'express';
import passport from 'passport';
import imgUploadController from './imgUpload.controller';
import {checkTempFolder, multipartMiddleware} from '../../utils/fileUtils';

export const imgUploadRouter = express.Router();
imgUploadRouter
  .route('/:id')
  .get(imgUploadController.findFileById);

imgUploadRouter
  .route('/')
  .post(checkTempFolder, multipartMiddleware, imgUploadController.uploadFile)
