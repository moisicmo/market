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
      const item = state.cart.find((item) => item.productModel.id == action.payload.productModel.id);
      if (!item) {
        state.cart = [...state.cart, action.payload]
      }
    },

    setUpdateItemCart: (state, action: PayloadAction<CartItem>) => {
      state.cart = state.cart.map((item) => {
        if (item.productModel.id == action.payload.productModel.id) {
          return action.payload;
        }
        return item;
      });
    },

    setRemoveCart: (state, action: PayloadAction<CartItem>) => {
      state.cart = state.cart.filter(
        (e) => e.productModel.id !== action.payload.productModel.id
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