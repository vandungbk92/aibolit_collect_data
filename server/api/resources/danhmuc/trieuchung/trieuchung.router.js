import express from 'express';
import passport from 'passport';
import trieuchungController from './trieuchung.controller';

export const trieuchungRouter = express.Router();
trieuchungRouter
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), trieuchungController.getAll)
  .post(passport.authenticate('jwt', { session: false }), trieuchungController.create)

trieuchungRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), trieuchungController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), trieuchungController.delete)
  .put(passport.authenticate('jwt', { session: false }), trieuchungController.update);
