import type { BranchModel, RoleModel } from '@/models';
import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    status: 'checking',
    user: {},
    roleUser: null as RoleModel | null,
    branchesUser: [] as BranchModel[],
    branchSelect: null as BranchModel | null,
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
    },
    setRoleUser: (state, { payload }) => {
      state.roleUser = payload.role;
    },
    setBranchesUser: (state, { payload }) => {
      state.branchesUser = payload.branches;
    },
    setBranch: (state, { payload }) => {
      state.branchSelect = payload.branch;
    },
  }
});


// Action creators are generated for each case reducer function
export const { onLogin, onLogout, setRoleUser, setBranchesUser, setBranch } = authSlice.actions;