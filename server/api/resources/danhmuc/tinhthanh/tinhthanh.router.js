import express from 'express';
import passport from 'passport';
import tinhthanhController from './tinhthanh.controller';

export const tinhthanhRouter = express.Router();
tinhthanhRouter
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), tinhthanhController.getAll)
  .post(passport.authenticate('jwt', { session: false }), tinhthanhController.create)

tinhthanhRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), tinhthanhController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), tinhthanhController.delete)
  .put(passport.authenticate('jwt', { session: false }), tinhthanhController.update);

tinhthanhRouter.get('/:id/quan-huyen', passport.authenticate('jwt', { session: false }), tinhthanhController.dsQuanHuyenByTinh)
