import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type ProductModel, type ProductRequest } from '@/models';
import { useState } from 'react';

export const useProductStore = () => {
  const [dataProduct, setDataProduct] = useState<BaseResponse<ProductModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'product';

  const getProducts = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<ProductModel> = {
        ...meta,
        data,
      };
      setDataProduct(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const createProduct = async (body: ProductRequest) => {
    try {
      const { data } = await coffeApi.post(`${baseUrl}`, body);
      console.log(data);
      getProducts();
      showSuccess('Especialidad creada correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateProduct = async (id: string, body: ProductRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      getProducts();
      showSuccess('Especialidad editada correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteProduct = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getProducts();
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
    dataProduct,
    //* Métodos
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
