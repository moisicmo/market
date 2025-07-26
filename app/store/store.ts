import { configureStore } from '@reduxjs/toolkit';
import {
  authSlice,
  cartSlice,
  debtSlice,
} from '.';

export const store = configureStore({
  reducer: {
    auth: authSlice.reducer,
    Debts: debtSlice.reducer,
    carts:cartSlice.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});
