import { combineReducers } from "redux";
import { connectRouter } from "connected-react-router";

import history from "@utils/history";

import toggleSiderReducer from "@containers/Layout/HeaderComponent/reducer";

export default function createReducer(injectedReducers = {}) {
  return combineReducers({
    toggleSider: toggleSiderReducer,
    router: connectRouter(history),
    ...injectedReducers
  });
}
