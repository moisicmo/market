import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { onLogin, onLogout, setBranch, setBranchesUser, setRoleUser, setUserProfile } from '@/store';
import { useAppSelector, useErrorStore } from '.';
import type { AuthModel, AuthRequest, BranchModel, ValidatePinRequest, UpdateProfileRequest, UpdatePasswordRequest, ForgotPasswordRequest } from '@/models';
import { useState } from 'react';

export interface validateEmail {
  idUser: string;
  key: string;
  email: string;
}

const decodeTokenProfile = (token: string): { name: string; lastName: string; email: string } => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
    return { name: payload.name ?? '', lastName: payload.lastName ?? '', email: payload.email ?? '' };
  } catch {
    return { name: '', lastName: '', email: '' };
  }
};


export const useAuthStore = () => {
  const { status, user, userProfile, roleUser, branchesUser, branchSelect } = useAppSelector(state => state.auth);
  const [showValidateEmail, setShowValidateEmail] = useState<validateEmail | null>(null);

  const dispatch = useDispatch();
  const { handleError } = useErrorStore();

  const startLogin = async (body: AuthRequest): Promise<boolean> => {
    try {
      const { data }: { data: AuthModel } = await coffeApi.post('/auth', body);
      const user = `${data.name} ${data.lastName}`;
      const role = data.role;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', user);
      localStorage.setItem('role', JSON.stringify(role));
      localStorage.setItem('branches', JSON.stringify(data.branches));
      localStorage.setItem('branchSelect', JSON.stringify(data.branches[0]));
      dispatch(onLogin(user));
      dispatch(setUserProfile({ name: data.name, lastName: data.lastName, email: data.email ?? '' }));
      dispatch(setRoleUser({ role }));
      dispatch(setBranchesUser({ branches: data.branches }));
      setBranchSelect(data.branches[0]);
      return true;
    } catch (error: any) {
      dispatch(onLogout());

      const data = error?.response?.data;

      if (data?.key === 'validar correo') {
        setShowValidateEmail({
          idUser: data.idUser,
          key: data.key,
          email: data.email,
        });
        sendPin(data.idUser);
        return false;
      }
      handleError(error);
      return false;
    }
  };

  const checkAuthToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = localStorage.getItem('user');
      dispatch(onLogin(user));
      dispatch(setUserProfile(decodeTokenProfile(token)));
      // rol
      const role = localStorage.getItem('role');
      if (role != null){
        dispatch(setRoleUser({ role: JSON.parse(role) }));
      }
      //branches
      const branches = localStorage.getItem('branches');
      if (branches != null) {
        dispatch(setBranchesUser({ branches: JSON.parse(branches) }));
      }
      // branch select
      const branchSelect = localStorage.getItem('branchSelect');
      if (branchSelect != null) {
        dispatch(setBranch({ branch: JSON.parse(branchSelect) }));
      }
      return true;
    } else {
      localStorage.clear();
      dispatch(onLogout());
      return false;
    }
  };

  const sendPin = async (idUser: string) => {
    const resp = await coffeApi.get(`/auth/sendPin/${idUser}`);
    console.log(resp.data);
  }


  const validatePin = async (body: ValidatePinRequest) => {
    const resp = await coffeApi.post(`/auth/validatePin`, body);
    console.log(resp.data);
  }

  const forgotPassword = async (body: ForgotPasswordRequest): Promise<{ idUser: string; email: string }> => {
    const { data } = await coffeApi.post('/auth/forgot-password', body);
    return data;
  };

  const updateProfile = async (body: UpdateProfileRequest) => {
    const { data } = await coffeApi.patch('/auth/profile', body);
    const newName = `${body.name} ${body.lastName}`;
    localStorage.setItem('user', newName);
    dispatch(onLogin(newName));
    dispatch(setUserProfile({ name: body.name, lastName: body.lastName, email: body.email ?? '' }));
    return data;
  };

  const updatePassword = async (body: UpdatePasswordRequest) => {
    const { data } = await coffeApi.patch('/auth/password', body);
    return data;
  };

  const setBranchSelect = (branch: BranchModel) => {
    localStorage.setItem('branchSelect', JSON.stringify(branch));
    dispatch(setBranch({ branch }));
  };


  return {
    //* Propiedades
    status,
    user,
    userProfile,
    roleUser,
    showValidateEmail,
    branchesUser,
    branchSelect,
    //* Métodos
    startLogin,
    checkAuthToken,
    setShowValidateEmail,
    sendPin,
    validatePin,
    setBranchSelect,
    forgotPassword,
    updateProfile,
    updatePassword,
  };
};

export const useLogoutStore = () => {
  const dispatch = useDispatch();
  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogout());
  };
  return {
    startLogout,
  };
};
