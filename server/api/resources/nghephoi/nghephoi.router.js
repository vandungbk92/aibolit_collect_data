import express from 'express';
import passport from 'passport';
import nghephoiController from './nghephoi.controller';

export const nghephoiRouter = express.Router();


nghephoiRouter.post('/', passport.authenticate('jwt', { session: false }), nghephoiController.create)
nghephoiRouter.get('/', passport.authenticate('jwt', { session: false }), nghephoiController.findAll);

nghephoiRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), nghephoiController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), nghephoiController.delete)
  .put(passport.authenticate('jwt', { session: false }), nghephoiController.update)
