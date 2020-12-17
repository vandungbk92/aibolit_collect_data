import express from 'express';
import passport from 'passport';
import noisoitaiController from './noisoitai.controller';

export const noisoitaiRouter = express.Router();


noisoitaiRouter.post('/', noisoitaiController.create)
noisoitaiRouter.get('/', noisoitaiController.findAll);

noisoitaiRouter
  .route('/:id')
  .get(noisoitaiController.findOne)
  .delete(noisoitaiController.delete)
  .put(noisoitaiController.update)
