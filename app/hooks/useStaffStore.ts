import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type StaffModel, type StaffRequest } from '@/models';
import { useState } from 'react';

export const useStaffStore = () => {
  const [dataStaff, setDataStaff] = useState<BaseResponse<StaffModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'staff';

  const getStaffs = async (page = 1, limit = 10, keys = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<StaffModel> = {
        ...meta,
        data,
      };
      setDataStaff(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const createStaff = async (body: StaffRequest) => {
    try {
      const { data } = await coffeApi.post(`/${baseUrl}/`, body);
      console.log(data);
      getStaffs();
      showSuccess('Staff creado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateStaff = async (id: string, body: StaffRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      getStaffs();
      showSuccess('Staff editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteStaff = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getStaffs();
        showSuccess('Staff eliminado correctamente');
      } else {
        showError('Cancelado', 'El Staff esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataStaff,
    //* Métodos
    getStaffs,
    createStaff,
    updateStaff,
    deleteStaff,
  };
};
