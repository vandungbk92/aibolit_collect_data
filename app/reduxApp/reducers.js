import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import history from "@utils/history";

import toggleSiderReducer from "@containers/Layout/HeaderComponent/reducer";
import { getPermissionReducer } from "@containers/Layout/HeaderComponent/HeaderProvider/reducer";

export default function createReducer(injectedReducers = {}) {
  return combineReducers({
    toggleSider: toggleSiderReducer,
    permission: getPermissionReducer,
    router: connectRouter(history),
    ...injectedReducers
  });
}
