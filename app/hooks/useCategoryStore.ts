import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type CategoryModel, type CategoryRequest } from '@/models';
import { useState } from 'react';

export const useCategoryStore = () => {
  const [dataCategory, setDataCategory] = useState<BaseResponse<CategoryModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'category';

  const getCategories = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<CategoryModel> = {
        ...meta,
        data,
      };
      setDataCategory(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const getCategoriesByBranch = async (branchId: string, page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}/branch/${branchId}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<CategoryModel> = {
        ...meta,
        data,
      };
      setDataCategory(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const createCategory = async (body: CategoryRequest) => {
    try {
      const { data } = await coffeApi.post(`${baseUrl}`, body);
      console.log(data);
      getCategories();
      showSuccess('Especialidad creada correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateCategory = async (id: string, body: CategoryRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      getCategories();
      showSuccess('Especialidad editada correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteCategory = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getCategories();
        showSuccess('Especialidad eliminado correctamente');
      } else {
        showError('Cancelado', 'El módulo esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataCategory,
    //* Métodos
    getCategories,
    getCategoriesByBranch,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};
