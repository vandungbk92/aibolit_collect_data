import express from 'express';
import passport from 'passport';
import audioController from './audio.controller';

export const audioRouter = express.Router();

audioRouter.post('/', passport.authenticate('jwt', { session: false }), audioController.create);
audioRouter.get('/', passport.authenticate('jwt', { session: false }), audioController.getAll);


audioRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), audioController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), audioController.delete)
  .put(passport.authenticate('jwt', { session: false }), audioController.update)
