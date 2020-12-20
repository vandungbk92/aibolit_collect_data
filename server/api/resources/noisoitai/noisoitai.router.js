import express from 'express';
import passport from 'passport';
import noisoitaiController from './noisoitai.controller';
import noisoihongController from '../noisoihong/noisoihong.controller';

export const noisoitaiRouter = express.Router();


noisoitaiRouter.post('/',passport.authenticate('jwt', { session: false }),  noisoitaiController.create)
noisoitaiRouter.get('/',passport.authenticate('jwt', { session: false }),  noisoitaiController.findAll);

noisoitaiRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), noisoitaiController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), noisoitaiController.delete)
  .put(passport.authenticate('jwt', { session: false }), noisoitaiController.update)
