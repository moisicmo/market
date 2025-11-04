import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type ProviderModel, type ProviderRequest } from '@/models';
import { useState } from 'react';

export const useProviderStore = () => {
  const [dataProvider, setDataProvider] = useState<BaseResponse<ProviderModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'provider';

  const getCategories = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<ProviderModel> = {
        ...meta,
        data,
      };
      setDataProvider(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const getCategoriesByBranch = async (branchId: string, page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}/branch/${branchId}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<ProviderModel> = {
        ...meta,
        data,
      };
      setDataProvider(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const createProvider = async (body: ProviderRequest) => {
    try {
      const { data } = await coffeApi.post(`${baseUrl}`, body);
      console.log(data);
      getCategories();
      showSuccess('Categoría creada correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateProvider = async (id: string, body: ProviderRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      getCategories();
      showSuccess('Categoría editada correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteProvider = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getCategories();
        showSuccess('Categoría eliminado correctamente');
      } else {
        showError('Cancelado', 'El módulo esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataProvider,
    //* Métodos
    getCategories,
    getCategoriesByBranch,
    createProvider,
    updateProvider,
    deleteProvider,
  };
};
