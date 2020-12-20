import express from 'express';
import passport from 'passport';
import soidaController from './soida.controller';
import noisoihongController from '../noisoihong/noisoihong.controller';

export const soidaRouter = express.Router();


soidaRouter.post('/',passport.authenticate('jwt', { session: false }),  soidaController.create)
soidaRouter.get('/',passport.authenticate('jwt', { session: false }),  soidaController.findAll);

soidaRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), soidaController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), soidaController.delete)
  .put(passport.authenticate('jwt', { session: false }), soidaController.update)
