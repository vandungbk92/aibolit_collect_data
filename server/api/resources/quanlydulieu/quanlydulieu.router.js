import express from 'express';
import passport from 'passport';
import quanlydulieuController from './quanlydulieu.controller';

export const quanlydulieuRouter = express.Router();

quanlydulieuRouter.post('/', passport.authenticate('jwt', { session: false }), quanlydulieuController.create);
quanlydulieuRouter.get('/', passport.authenticate('jwt', { session: false }), quanlydulieuController.getAll);


quanlydulieuRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), quanlydulieuController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), quanlydulieuController.delete)
  .put(passport.authenticate('jwt', { session: false }), quanlydulieuController.update)
