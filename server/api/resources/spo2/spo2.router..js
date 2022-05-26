import express from 'express';
import spo2Controller from './spo2.controller';
import { checkTempFolder, multipartMiddleware } from '../../utils/fileUtils';
import passport from 'passport';

export const SpO2Router = express.Router();
SpO2Router
  .route('/')
  .get(passport.authenticate('jwt', { session: false }), spo2Controller.getAllDates)

SpO2Router
  .route('/phantich/:id')
  .get(spo2Controller.phantichFunc)

SpO2Router
  .route('/phantich2')
  .get(spo2Controller.phantichFunc2)

SpO2Router.post('/', checkTempFolder, multipartMiddleware, passport.authenticate('jwt', { session: false }), spo2Controller.oximeterFile)
SpO2Router.get('/detail', passport.authenticate('jwt', { session: false }), spo2Controller.getListDateByUser)

SpO2Router
  .route('/:id')
  .get(spo2Controller.getDate)
  .post(checkTempFolder, multipartMiddleware, spo2Controller.oximeterFile);



