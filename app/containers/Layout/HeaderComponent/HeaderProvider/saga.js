import { all, call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import { API } from '@api';
import { GET_MY_INFO, UPDATE_MY_INFO } from './constants';
import { myInfoLoaded, myInfoLoadingError, updateMyInfoSuccess, updateMyInfoError} from './actions';
import { getPermissionByUser } from '@commons/functionCommons';
import { updateById, updateAvatarById } from '@services/userService';

export function* getInfo() {
  const response = yield call(() => axios.get(API.USER_INFO));
  if (response && response.status === 200) {
    let dataUser = response.data;
    yield all([
       put(myInfoLoaded(dataUser))
    ])
  } else {
    yield put(myInfoLoadingError());
  }
}

export function* updateInfo(action) {
  const { data } = action;
  const { _id, avatarFile, ...userData } = data;
  try {
    let avatarId;
    if (avatarFile) {
      const formData = new FormData();
      formData.append("file", avatarFile);
      const responseAvatar = yield call(updateAvatarById, _id, formData);
      if (responseAvatar) {
        avatarId = responseAvatar.file_id;
      }
    }

    const responseData = yield call(updateById, _id, userData);
    yield put(updateMyInfoSuccess({...responseData, ...avatarId && {avatar: avatarId}}));
  } catch (e) {
    yield put(updateMyInfoError());
  }
}

export default function* saga() {
  yield all([
    takeLatest(GET_MY_INFO, getInfo),
    takeLatest(UPDATE_MY_INFO, updateInfo),
  ]);
}
