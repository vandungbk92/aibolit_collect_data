import express from 'express';
import passport from 'passport';
import spo2Controller from './spo2.controller';

export const SpO2Router = express.Router();
SpO2Router
  .route('/')
  .get(spo2Controller.getAll)
  .post(spo2Controller.create)
