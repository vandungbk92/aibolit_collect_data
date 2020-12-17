import express from 'express';
import passport from 'passport';
import phuongxaController from './phuongxa.controller';

export const phuongxaRouter = express.Router();
phuongxaRouter
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), phuongxaController.getAll)
  .post(passport.authenticate('jwt', { session: false }), phuongxaController.create)

phuongxaRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), phuongxaController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), phuongxaController.delete)
  .put(passport.authenticate('jwt', { session: false }), phuongxaController.update);

