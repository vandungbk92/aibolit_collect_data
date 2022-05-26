import express from 'express';
import passport from 'passport';
import settingController from './setting.controller';

export const settingRouter = express.Router();


settingRouter.post('/',passport.authenticate('jwt', { session: false }),  settingController.create)
settingRouter.get('/',passport.authenticate('jwt', { session: false }),  settingController.findAll);
settingRouter.get('/me',passport.authenticate('jwt', { session: false }),  settingController.findSettingByUser);
settingRouter.put('/me',passport.authenticate('jwt', { session: false }),  settingController.putSettingByUser);

settingRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), settingController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), settingController.delete)
  .put(passport.authenticate('jwt', { session: false }), settingController.update)
