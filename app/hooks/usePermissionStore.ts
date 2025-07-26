import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { useErrorStore } from '.';
import { useState } from 'react';
import { InitBaseResponse, type BaseResponse, type PermissionModel } from '@/models';

export const usePermissionStore = () => {
  const [dataPermission, setDataPermission] = useState<BaseResponse<PermissionModel>>(InitBaseResponse);

  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const baseUrl = 'permission';

  const getPermissions = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<PermissionModel> = {
        ...meta,
        data,
      };
      setDataPermission(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataPermission,
    //* Métodos
    getPermissions,
  };
};
