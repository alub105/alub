import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import user from "./user";
import study from "./study";

const persistConfig = {
  key: "root",
  storage,
};
const rootReducer = combineReducers({ user });

const rootReducer = combineReducers({ user, study });

export default persistReducer(persistConfig, rootReducer);
