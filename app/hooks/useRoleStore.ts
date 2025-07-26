import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type RoleModel } from '@/models';
import type { RoleRequest } from '@/models/request/role.request';
import { useState } from 'react';

export const useRoleStore = () => {
  const [dataRole, setDataRole] = useState<BaseResponse<RoleModel>>(InitBaseResponse);

  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'role';



  const getRoles = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<RoleModel> = {
        ...meta,
        data,
      };
      setDataRole(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const createRole = async (body: RoleRequest) => {
    try {
      const { data } = await coffeApi.post(`/${baseUrl}`, body);
      console.log(data);
      getRoles();
      showSuccess('Rol creado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };

  const updateRole = async (id: string, body: RoleRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      getRoles();
      showSuccess('Rol editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };

  const deleteRole = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getRoles();
        showSuccess('Rol eliminado correctamente');
      } else {
        showError('Cancelado', 'El rol esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataRole,
    //* Métodos
    getRoles,
    createRole,
    updateRole,
    deleteRole,
  };
};
