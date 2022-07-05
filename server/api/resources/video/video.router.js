import express from 'express';
import passport from 'passport';
import videoController from './video.controller';

export const videoRouter = express.Router();

videoRouter.post('/', passport.authenticate('jwt', { session: false }), videoController.create);
videoRouter.get('/', passport.authenticate('jwt', { session: false }), videoController.getAll);


videoRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), videoController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), videoController.delete)
  .put(passport.authenticate('jwt', { session: false }), videoController.update)
