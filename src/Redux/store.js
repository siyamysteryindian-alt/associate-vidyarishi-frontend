import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // default: localStorage for web
import { combineReducers } from "redux";
import UserReducer from "./UserSlice";
import UniversityReducer from "./UniversitySlice";
import StudentReducer from "./StudentSlice";

// Define persist configuration
const persistConfig = {
  key: "root",
  storage, // Use localStorage to persist the state
  whitelist: ["user", "university"], // Only persist these slices
};

// Combine the reducers
const rootReducer = combineReducers({
  user: UserReducer,
  university: UniversityReducer,
  studentId: StudentReducer,
});

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Configure the store to use the persisted reducer
const store = configureStore({
  reducer: persistedReducer, // Use the persisted reducer instead of the plain one
});

// Create the persistor
const persistor = persistStore(store);

export { store, persistor };
