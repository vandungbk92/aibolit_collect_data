import express from 'express';
import passport from 'passport';
import imageController from './image.controller';

export const imageRouter = express.Router();

imageRouter.post('/', passport.authenticate('jwt', { session: false }), imageController.create);
imageRouter.get('/', passport.authenticate('jwt', { session: false }), imageController.getAll);


imageRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), imageController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), imageController.delete)
  .put(passport.authenticate('jwt', { session: false }), imageController.update)
