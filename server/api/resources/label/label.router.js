import express from 'express';
import passport from 'passport';
import labelController from './label.controller';

export const labelRouter = express.Router();

labelRouter.post('/', passport.authenticate('jwt', { session: false }), labelController.create);
labelRouter.get('/', passport.authenticate('jwt', { session: false }), labelController.getAll);


labelRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), labelController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), labelController.delete)
  .put(passport.authenticate('jwt', { session: false }), labelController.update)
