import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import storage from "redux-persist/lib/storage";

import authorSlice from "./authorSlice";
import postSlice from "./postSlice";
import colorSlice from "./colorSlice";
import socketSlice from "./socketSlice";
import chatSlice from "./chatSlice";
import notifySlice from './notifySlice'

const persistConfig = {
  key: "root",
  version: 1,
  storage,
};


const rootReducer = combineReducers({
  author: authorSlice,
  post: postSlice,
  color:colorSlice,
  socketchat:socketSlice,
  chat:chatSlice,
  notify:notifySlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

// 👇 Middleware is configured in `configureStore`, not `combineReducers`
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // This disables warnings related to non-serializable data (dev only)
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        warnAfter: 100, // optional: increases the warning threshold
      },
    }),
});

export default store;
