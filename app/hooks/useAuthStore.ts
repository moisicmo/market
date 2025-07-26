import { useDispatch, useSelector } from 'react-redux';
import { coffeApi } from '@/services';
import { onLogin, onLogout, setRoleUser } from '@/store';
import { useErrorStore } from '.';
import type { AuthModel, AuthRequest } from '@/models';

export const useAuthStore = () => {
  const { status, user } = useSelector((state: any) => state.auth);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();

  const startLogin = async (body: AuthRequest) => {
    try {
      const { data }: { data: AuthModel } = await coffeApi.post('/auth', body);
      console.log(data);
      const user = `${data.name} ${data.lastName}`;
      const role = data.role;
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', user);
      localStorage.setItem('role', JSON.stringify(role));
      dispatch(onLogin(user));
      dispatch(setRoleUser({ role }));
    } catch (error) {
      dispatch(onLogout());
      throw handleError(error);
    }
  };
  const checkAuthToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = localStorage.getItem('user');
      dispatch(onLogin(user));
      return true;
    } else {
      localStorage.clear();
      dispatch(onLogout());
      return false;
    }
  };


  return {
    //* Propiedades
    status,
    user,

    //* Métodos
    startLogin,
    checkAuthToken,
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
