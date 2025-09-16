import type { RoleModel } from '@/models';
import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: 'checking',
    user: {},
    roleUser: null as RoleModel | null,
    showPasswordChangeModal: false,
  },
  reducers: {
    onLogin: (state, { payload }) => {
      console.log(payload);
      state.status = 'authenticated';
      state.user = payload;
    },
    onLogout: (state) => {
      state.status = 'not-authenticated';
      state.user = {};
      state.showPasswordChangeModal = false; // Reset on logout
    },
    setRoleUser: (state, { payload }) => {
      state.roleUser = payload.role;
    },
    onSetShowPasswordChangeModal: (state, { payload }) => {
      state.showPasswordChangeModal = payload;
    },
  }
});


// Action creators are generated for each case reducer function
export const { onLogin, onLogout, setRoleUser, onSetShowPasswordChangeModal } = authSlice.actions;