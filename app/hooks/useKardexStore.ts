import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type KardexModel, type ProductRequest } from '@/models';
import { useState } from 'react';

export const useKardexStore = () => {
  const [dataKardexPresentation, setDataKardexPresentation] = useState<BaseResponse<KardexModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { showSuccess } = useAlertStore();
  const baseUrl = 'kardex';

  const getPresentationsByBranchId = async (branchId: string, page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?branchId=${branchId}&page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<KardexModel> = {
        ...meta,
        data,
      };
      setDataKardexPresentation(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const createProduct = async (body: ProductRequest) => {
    try {
      const { data } = await coffeApi.post(`${baseUrl}`, body);
      console.log(data);
      showSuccess('Producto creado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };


  return {
    //* Propiedades
    dataKardexPresentation,
    //* Métodos
    getPresentationsByBranchId,
    createProduct,
  };
};
