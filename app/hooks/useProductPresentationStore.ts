import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type ProductModel, type ProductRequest } from '@/models';
import { useState } from 'react';

export const useProductPresentationStore = () => {
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'product';

  const createProductPresentation = async (body: ProductRequest) => {
    try {
      const { data } = await coffeApi.post(`${baseUrl}`, body);
      console.log(data);
      // getProducts();
      showSuccess('Producto creado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const updateProductPresentation = async (id: string, body: ProductRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      // getProducts();
      showSuccess('Producto editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteProductPresentation = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        // getProducts();
        showSuccess('Producto eliminado correctamente');
      } else {
        showError('Cancelado', 'El módulo esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Métodos
    // getProducts,
    createProductPresentation,
    updateProductPresentation,
    deleteProductPresentation,
  };
};
