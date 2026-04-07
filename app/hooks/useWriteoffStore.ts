import { useState } from 'react';
import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore, usePrintStore } from '.';
import { InitBaseResponse, type BaseResponse, type WriteoffModel, type WriteoffRequest } from '@/models';

export const useWriteoffStore = () => {
  const { handleError } = useErrorStore();
  const { showLoading, swalClose, showSuccess } = useAlertStore();
  const { handleXlsx } = usePrintStore();
  const baseUrl = 'writeoff';

  const [dataWriteoffs, setDataWriteoffs] = useState<BaseResponse<WriteoffModel>>(InitBaseResponse<WriteoffModel>());

  const getWriteoffs = async (page = 1, limit = 10, branchId = '', keys = '') => {
    try {
      const res = await coffeApi.get(
        `/${baseUrl}?page=${page}&limit=${limit}&branchId=${branchId}&keys=${keys}`,
      );
      const { data, meta } = res.data;
      setDataWriteoffs({ ...meta, data });
    } catch (error) {
      throw handleError(error);
    }
  };

  const createWriteoff = async (body: WriteoffRequest) => {
    try {
      showLoading('Registrando baja...');
      await coffeApi.post(`/${baseUrl}`, body);
      swalClose();
      showSuccess('Baja registrada correctamente');
    } catch (error) {
      swalClose();
      throw handleError(error);
    }
  };

  const exportWriteoffs = async (branchId = '', keys = '') => {
    try {
      showLoading('Generando reporte...');
      const res = await coffeApi.get(
        `/${baseUrl}/export?branchId=${branchId}&keys=${keys}`,
      );
      swalClose();
      handleXlsx(res.data.xlsxBase64, 'reporte-bajas.xlsx');
    } catch (error) {
      swalClose();
      throw handleError(error);
    }
  };

  return {
    dataWriteoffs,
    getWriteoffs,
    createWriteoff,
    exportWriteoffs,
  };
};
