import { configureStore } from '@reduxjs/toolkit';
import themeReducer from './themeSlice';
import userReducer from './userSlice';
import tablesReducer from './tableSlice';

export const store = configureStore({
  reducer: {
    theme: themeReducer,
    user: userReducer,
    tables: tablesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
