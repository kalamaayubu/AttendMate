import AsyncStorage from "@react-native-async-storage/async-storage";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import reportDataReducer from "./reportData";
import userReducer from "./userSlice";

const rootReducer = combineReducers({
  user: userReducer,
  reportData: reportDataReducer, // Not persisted
});

const persistConfig = {
  key: "root", // Key for the persisted state
  storage: AsyncStorage, // Use AsyncStorage for React Native
  whitelist: ["user"], // slice to be persisted
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable serializable check for redux-persist
    }),
});
export const persistor = persistStore(store);

// Types for convenience
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
