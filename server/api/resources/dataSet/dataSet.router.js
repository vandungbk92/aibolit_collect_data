import express from 'express';
import passport from 'passport';
import dataSetController from './dataSet.controller';

export const dataSetRouter = express.Router();

dataSetRouter.post('/', passport.authenticate('jwt', { session: false }), dataSetController.create);
dataSetRouter.get('/', passport.authenticate('jwt', { session: false }), dataSetController.getAll);


dataSetRouter
  .route('/:id')
  .get(passport.authenticate('jwt', { session: false }), dataSetController.findOne)
  .delete(passport.authenticate('jwt', { session: false }), dataSetController.delete)
  .put(passport.authenticate('jwt', { session: false }), dataSetController.update)
