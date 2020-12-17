import produce from "immer";

import { FETCH_BENH_SUCCESS, FETCH_TINHTHANH_SUCCESS, FETCH_TRIEUCHUNG_SUCCESS } from "./constants";

export const initialState = {
  benh: [],
  tinhthanh: [],
  trieuchung: []
};

const danhmucReducer = (state = initialState, action) =>
  produce(state, draft => {
    switch (action.type) {
      case FETCH_BENH_SUCCESS:
        draft.benh = action.data;
        break;

      case FETCH_TINHTHANH_SUCCESS:
        draft.tinhthanh = action.data;
        break;

      case FETCH_TRIEUCHUNG_SUCCESS:
        draft.trieuchung = action.data;
        break;
    }
  });

export default danhmucReducer;
