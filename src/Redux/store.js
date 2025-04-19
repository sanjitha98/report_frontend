import { configureStore } from "@reduxjs/toolkit";
import loginReducer from "../Redux/slice/loginSlice";
import commonReducer from "../Redux/slice/commonSlice";
import { persistReducer } from "redux-persist";
import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  login: persistReducer(persistConfig, loginReducer),
  common: persistReducer(persistConfig, commonReducer),
});

export default configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware({ serializableCheck: false }),
});
