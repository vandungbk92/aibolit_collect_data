import express from 'express';
import passport from 'passport';
import quanhuyenController from './quanhuyen.controller';

export const quanhuyenRouter = express.Router();
quanhuyenRouter
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), quanhuyenController.getAll)
  .post(passport.authenticate('jwt', { session: false }), quanhuyenController.create)

quanhuyenRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), quanhuyenController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), quanhuyenController.delete)
  .put(passport.authenticate('jwt', { session: false }), quanhuyenController.update);

quanhuyenRouter.get('/:id/phuong-xa', passport.authenticate('jwt', { session: false }), quanhuyenController.dsPhuongXaByHuyen)
