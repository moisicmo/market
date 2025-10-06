import { coffeApi } from '@/services';
import { useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type KardexModel, type Movement } from '@/models';
import { useState } from 'react';

export const useKardexStore = () => {
  const [dataKardexPresentation, setDataKardexPresentation] = useState<BaseResponse<KardexModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
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

  const updatePresentations = (moviments: Movement[]) => {
    setDataKardexPresentation({
      ...dataKardexPresentation,
      data: dataKardexPresentation.data.map(d => {
        const moviment = moviments.find(
          m => (m.input?.productPresentationId ?? m.output?.productPresentationId) === d.presentation.id
        );
        if (moviment) {
          return {
            ...d,
            stock: moviment.stock,
            kardex: [moviment, ...(d.kardex ?? [])]
          };
        }
        return d;
      })
    });
  };



  return {
    //* Propiedades
    dataKardexPresentation,
    //* Métodos
    getPresentationsByBranchId,
    updatePresentations,
  };
};
