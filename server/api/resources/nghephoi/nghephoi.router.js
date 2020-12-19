import express from 'express';
import passport from 'passport';
import nghephoiController from './nghephoi.controller';

export const nghephoiRouter = express.Router();


nghephoiRouter.post('/', nghephoiController.create)
nghephoiRouter.get('/', nghephoiController.findAll);

nghephoiRouter
  .route('/:id')
  .get(nghephoiController.findOne)
  .delete(nghephoiController.delete)
  .put(nghephoiController.update)
