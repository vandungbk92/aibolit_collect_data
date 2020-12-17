// khi gọi action thì sẽ tìm kiếm ở saga thực hiện các hàm gọi api

import { call, put, select, takeLatest } from "redux-saga/effects";

import { getAll as getAllTinThanh } from "@services/danhmuc/tinhthanhService";
import { getAll as getAllBenh } from "@services/danhmuc/benhService";
import { getAll as getAllTrieuChung } from "@services/danhmuc/trieuchungService";

import { FETCH_BENH, FETCH_TINHTHANH, FETCH_TRIEUCHUNG } from "./constants";
import {
  fetchBenhSuccess,
  fetchBenhError,
  fetchTinhThanhSuccess,
  fetchTinhThanhError,
  fetchTrieuChungSuccess,
  fetchTrieuChungError
} from "./actions";

export function* fetchBenh() {
  try {
    const benhRes = yield call(getAllBenh, 1, 0);
    if (benhRes && benhRes.docs) {
      yield put(fetchBenhSuccess(benhRes.docs));
    } else {
      yield put(fetchBenhError());
    }
  } catch (error) {
    yield put(fetchBenhError(error));
  }
}

export function* fetchTrieuChung() {
  try {
    const trieuchungRes = yield call(getAllTrieuChung, 1, 0);
    if (trieuchungRes && trieuchungRes.docs) {
      yield put(fetchTrieuChungSuccess(trieuchungRes.docs));
    } else {
      yield put(fetchTrieuChungError());
    }
  } catch (error) {
    yield put(fetchTrieuChungError(error));
  }
}

export function* fetchTinhThanh() {
  try {
    const tinhthanhRes = yield call(getAllTinThanh, 1, 0);
    if (tinhthanhRes && tinhthanhRes.docs) {
      yield put(fetchTinhThanhSuccess(tinhthanhRes.docs));
    } else {
      yield put(fetchTinhThanhError());
    }
  } catch (error) {
    yield put(fetchTinhThanhError(error));
  }
}

export default function* danhmucSaga() {
  yield takeLatest(FETCH_TINHTHANH, fetchTinhThanh);
  yield takeLatest(FETCH_BENH, fetchBenh);
  yield takeLatest(FETCH_TRIEUCHUNG, fetchTrieuChung);
}
