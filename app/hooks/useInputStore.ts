import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type CategoryModel, type InputRequest } from '@/models';
import { useState } from 'react';

export const useInputStore = () => {
  const [dataCategory, setDataCategory] = useState<BaseResponse<CategoryModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'input';


  const createInput = async (body: InputRequest) => {
    try {
      console.log(body);
      const { data } = await coffeApi.post(`${baseUrl}`, body);
      console.log(data);
      showSuccess('Creado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataCategory,
    //* Métodos
    createInput,
  };
};
