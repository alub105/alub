import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import user from "./user";
import study from "./study";

const persistConfig = {
  key: "root",
  storage,
};
<<<<<<< HEAD
<<<<<<< develop
=======
const rootReducer = combineReducers({ user, study });
>>>>>>> local
=======
const rootReducer = combineReducers({ user });
>>>>>>> 7bb454397d2a39399ee31713e5a57bff7cbc44a4

export default persistReducer(persistConfig, rootReducer);
