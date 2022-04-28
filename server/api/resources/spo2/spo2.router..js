import express from 'express';
import passport from 'passport';
import spo2Controller from './spo2.controller';

export const SpO2Router = express.Router();
SpO2Router
  .route('/')
  .get(spo2Controller.getAllDates)
  .post(spo2Controller.create);

SpO2Router
  .route('/:id')
  .get(spo2Controller.getDate);


