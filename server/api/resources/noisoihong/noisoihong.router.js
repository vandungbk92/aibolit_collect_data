import express from 'express';
import passport from 'passport';
import noisoihongController from './noisoihong.controller';

export const noisoihongRouter = express.Router();


noisoihongRouter.post('/', noisoihongController.create)
noisoihongRouter.get('/', noisoihongController.findAll);

noisoihongRouter
  .route('/:id')
  .get(noisoihongController.findOne)
  .delete(noisoihongController.delete)
  .put(noisoihongController.update)
