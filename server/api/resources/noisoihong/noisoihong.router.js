import express from 'express';
import passport from 'passport';
import noisoihongController from './noisoihong.controller';

export const noisoihongRouter = express.Router();


noisoihongRouter.post('/', passport.authenticate('jwt', { session: false }), noisoihongController.create)
noisoihongRouter.get('/', passport.authenticate('jwt', { session: false }), noisoihongController.findAll);

noisoihongRouter
  .route('/:id')
  .get( passport.authenticate('jwt', { session: false }), noisoihongController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), noisoihongController.delete)
  .put(passport.authenticate('jwt', { session: false }), noisoihongController.update)
