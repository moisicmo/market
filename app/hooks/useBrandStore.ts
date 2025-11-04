import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type BrandModel, type BrandRequest } from '@/models';
import { useState } from 'react';

export const useBrandStore = () => {
  const [dataBrand, setDataBrand] = useState<BaseResponse<BrandModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'brand';

  const getCategories = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<BrandModel> = {
        ...meta,
        data,
      };
      setDataBrand(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const getCategoriesByBranch = async (branchId: string, page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}/branch/${branchId}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<BrandModel> = {
        ...meta,
        data,
      };
      setDataBrand(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const createBrand = async (body: BrandRequest) => {
    try {
      const { data } = await coffeApi.post(`${baseUrl}`, body);
      console.log(data);
      getCategories();
      showSuccess('Categoría creada correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateBrand = async (id: string, body: BrandRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      getCategories();
      showSuccess('Categoría editada correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteBrand = async (id: string) => {
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
    dataBrand,
    //* Métodos
    getCategories,
    getCategoriesByBranch,
    createBrand,
    updateBrand,
    deleteBrand,
  };
};
