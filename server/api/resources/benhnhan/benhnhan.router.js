import express from 'express';
import passport from 'passport';
import benhnhanController from './benhnhan.controller';

export const benhnhanRouter = express.Router();
benhnhanRouter
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), benhnhanController.getAll)
  .post(passport.authenticate('jwt', { session: false }), benhnhanController.create)

benhnhanRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), benhnhanController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), benhnhanController.delete)
  .put(passport.authenticate('jwt', { session: false }), benhnhanController.update);
