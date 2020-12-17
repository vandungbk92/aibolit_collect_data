import {
  FETCH_TINHTHANH,
  FETCH_TINHTHANH_SUCCESS,
  FETCH_TINHTHANH_ERROR,
  FETCH_TRIEUCHUNG,
  FETCH_TRIEUCHUNG_SUCCESS,
  FETCH_TRIEUCHUNG_ERROR,
  FETCH_BENH,
  FETCH_BENH_SUCCESS,
  FETCH_BENH_ERROR
} from "./constants";

export function fetchTinhThanh() {
  return {
    type: FETCH_TINHTHANH
  };
}

export function fetchTinhThanhSuccess(data) {
  return {
    type: FETCH_TINHTHANH_SUCCESS,
    data
  };
}

export function fetchTinhThanhError(error) {
  return {
    type: FETCH_TINHTHANH_ERROR,
    error
  };
}

export function fetchTrieuChung() {
  return {
    type: FETCH_TRIEUCHUNG
  };
}

export function fetchTrieuChungSuccess(data) {
  return {
    type: FETCH_TRIEUCHUNG_SUCCESS,
    data
  };
}

export function fetchTrieuChungError(error) {
  return {
    type: FETCH_TRIEUCHUNG_ERROR,
    error
  };
}

export function fetchBenh() {
  return {
    type: FETCH_BENH
  };
}

export function fetchBenhSuccess(data) {
  return {
    type: FETCH_BENH_SUCCESS,
    data
  };
}

export function fetchBenhError(error) {
  return {
    type: FETCH_BENH_ERROR,
    error
  };
}
