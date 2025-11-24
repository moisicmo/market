import { coffeApi } from '@/services';
import { onLogin, onLogout, setBranch, setBranchesUser, setRoleUser } from '@/store';
import { useAppDispatch, useAppSelector, useErrorStore } from '.';
import type { AuthModel, AuthRequest, BranchModel } from '@/models';

export const useAuthStore = () => {
  const { status, user, branchesUser, branchSelect } = useAppSelector(state => state.auth);
  const dispatch = useAppDispatch();
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
      localStorage.setItem('branches', JSON.stringify(data.branches))
      dispatch(onLogin(user));
      setRoleUser({ role });
      dispatch(setBranchesUser({ branches: data.branches }));
    } catch (error) {
      dispatch(onLogout());
      throw handleError(error);
    }
  };

  const setBranchSelect = (branch: BranchModel) => {
    dispatch(setBranch({branch}));
  }
  const checkAuthToken = async () => {
    const token = localStorage.getItem('token');
    if (token) {
      const user = localStorage.getItem('user');
      dispatch(onLogin(user));
      const branches = localStorage.getItem('branches');
      if (branches != null) {
        dispatch(setBranchesUser({ branches: JSON.parse(branches)}));
      }
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
    branchesUser,
    branchSelect,
    //* Métodos
    startLogin,
    setBranchSelect,
    checkAuthToken,
  };
};

export const useLogoutStore = () => {
  const dispatch = useAppDispatch();
  const startLogout = () => {
    localStorage.clear();
    dispatch(onLogout());
  };
  return {
    startLogout,
  };
};
