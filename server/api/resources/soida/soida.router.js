import express from 'express';
import passport from 'passport';
import soidaController from './soida.controller';

export const soidaRouter = express.Router();


soidaRouter.post('/', soidaController.create)
soidaRouter.get('/', soidaController.findAll);

soidaRouter
  .route('/:id')
  .get(soidaController.findOne)
  .delete(soidaController.delete)
  .put(soidaController.update)
