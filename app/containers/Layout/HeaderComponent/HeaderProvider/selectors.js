import { createSelector } from 'reselect';
import { initialState } from './reducer';

const selectStateDashBoard = state => state.HeaderComponent || initialState;

const makeGetMyInfo = () =>
  createSelector(selectStateDashBoard, appState => appState.get('myInfo'));

export { makeGetMyInfo };
