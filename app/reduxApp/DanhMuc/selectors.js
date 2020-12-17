import { createSelector } from "reselect";

import { initialState } from "./reducer";

const selectDanhMuc = state => state.danhmuc || initialState;

export const selectBenh = createSelector(
  [selectDanhMuc],
  danhmucState => danhmucState.benh
);

export const selectTrieuChung = createSelector(
  [selectDanhMuc],
  danhmucState => danhmucState.trieuchung
);

export const selectTinhThanh = createSelector(
  [selectDanhMuc],
  danhmucState => danhmucState.tinhthanh
);
