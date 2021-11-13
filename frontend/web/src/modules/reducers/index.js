import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import user from "./user";
import study from "./study";

const rootReducer = combineReducers({ user });

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["user"],
};
<<<<<<< develop
=======
const rootReducer = combineReducers({ user, study });
>>>>>>> local

export default persistReducer(persistConfig, rootReducer);
