// import { combineReducers, configureStore } from '@reduxjs/toolkit';
// import storage from 'redux-persist/lib/storage';
// import { persistReducer, persistStore } from 'redux-persist';
// import themeConfigSlice from './themeConfigSlice';
// import tasksSlice from './Slices/taskSlice';
// import identitySlice from './Slices/identitySlice';

// const persistConfig = {
//   key: 'root',
//   storage,
//   whitelist: ['task'],
// };

// const rootReducer = combineReducers({
//   themeConfig: themeConfigSlice,
//   task: tasksSlice,
//   identity: identitySlice,
// });

// const persistedReducer = persistReducer(persistConfig, rootReducer);
// export const store = configureStore({
//   reducer: persistedReducer,
//   middleware: (getDefaultMiddleware) =>
//     getDefaultMiddleware({
//       serializableCheck: false,
//     }),
// });

// export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
// export type AppDispatch = typeof store.dispatch;

// export default store;


import { combineReducers, configureStore } from "@reduxjs/toolkit"
import storage from "redux-persist/lib/storage"
import { persistReducer, persistStore } from "redux-persist"
import themeConfigSlice from "./themeConfigSlice"
import tasksSlice from "./Slices/taskSlice"
import cardSlice from "./Slices/cardSlice"
import identitySlice from "./Slices/identitySlice"
import passwordSlice from "./Slices/passwordSlice"
import dataReducer from './Slices/TableSlice'



const persistConfig = {
  key: "root",
  storage,
  whitelist: ["task", "card", "identity", "password"], // Added 'card' to persist card data
}

const rootReducer = combineReducers({
  themeConfig: themeConfigSlice,
  task: tasksSlice,
  card: cardSlice,
  identity: identitySlice,
  password: passwordSlice, // Added cardSlice to the root reducer
  data: dataReducer,  //for table data
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
})

export const persistor = persistStore(store)

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

export default store
