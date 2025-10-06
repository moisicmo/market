// import type { FormPaymentModel } from '@/models';
import type { CartItem } from '@/models';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

const dataInit: CartItem[] = [];

export const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    cart: dataInit,
  },
  reducers: {
    setClearCart: (state,) => {
      state.cart = [];
    },

    setAddCart: (state, action: PayloadAction<CartItem>) => {
      const item = state.cart.find((item) => item.productPresentationModel.id == action.payload.productPresentationModel.id);
      if (!item) {
        state.cart = [...state.cart, action.payload]
      }
    },

    setUpdateItemCart: (state, action: PayloadAction<CartItem>) => {
      state.cart = state.cart.map((item) => {
        if (item.productPresentationModel.id == action.payload.productPresentationModel.id) {
          return action.payload;
        }
        return item;
      });
    },

    setRemoveCart: (state, action: PayloadAction<CartItem>) => {
      state.cart = state.cart.filter(
        (e) => e.productPresentationModel.id !== action.payload.productPresentationModel.id
      );
    },
  }
});


export const {
  setClearCart,
  setAddCart,
  setUpdateItemCart,
  setRemoveCart,
} = cartSlice.actions;