import express from 'express';
import passport from 'passport';
import benhController from './benh.controller';

export const benhRouter = express.Router();
benhRouter
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), benhController.getAll)
  .post(passport.authenticate('jwt', { session: false }), benhController.create)

benhRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), benhController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), benhController.delete)
  .put(passport.authenticate('jwt', { session: false }), benhController.update);
