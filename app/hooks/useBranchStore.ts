import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type BranchModel, type BranchRequest } from '@/models';
import { useState } from 'react';

export const useBranchStore = () => {
  const [dataBranch, setDataBranch] = useState<BaseResponse<BranchModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'branch';

  const getBranches = async (page: number = 1, limit: number = 10, keys: string = '') => {

    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<BranchModel> = {
        ...meta,
        data,
      };
      setDataBranch(payload);
    } catch (error) {
      throw handleError(error);
    }

  }

  const createBranch = async (body: BranchRequest) => {
    try {
      const { data } = await coffeApi.post(`/${baseUrl}/`, body);
      console.log(data)
      getBranches();
      showSuccess('Sucursal creado correctamente');
    } catch (error: any) {
      throw handleError(error);
    }
  }

  const updateBranch = async (id: string, body: BranchRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data)
      getBranches();
      showSuccess('Sucursal editado correctamente');
    } catch (error: any) {
      throw handleError(error);
    }
  }

  const deleteBranch = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getBranches();
        showSuccess('Sucursal eliminado correctamente');
      } else {
        showError('Cancelado', 'La sucursal esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  }
  return {
    //* Propiedades
    dataBranch,
    //* Métodos
    getBranches,
    createBranch,
    updateBranch,
    deleteBranch,
  }
}