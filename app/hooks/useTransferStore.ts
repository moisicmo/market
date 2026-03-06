import { useState } from 'react';
import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type TransferModel, type TransferRequest } from '@/models';

export const useTransferStore = () => {
  const { handleError } = useErrorStore();
  const { showLoading, swalClose, showSuccess } = useAlertStore();
  const baseUrl = 'transfer';

  const [dataTransfers, setDataTransfers] = useState<BaseResponse<TransferModel>>(
    InitBaseResponse<TransferModel>(),
  );

  const getTransfers = async (page = 1, limit = 10, branchId = '', keys = '') => {
    try {
      const res = await coffeApi.get(
        `/${baseUrl}?page=${page}&limit=${limit}&branchId=${branchId}&keys=${keys}`,
      );
      const { data, meta } = res.data;
      setDataTransfers({ ...meta, data });
    } catch (error) {
      throw handleError(error);
    }
  };

  const createTransfer = async (body: TransferRequest): Promise<void> => {
    try {
      showLoading('Registrando traspaso...');
      await coffeApi.post(`/${baseUrl}`, body);
      swalClose();
      showSuccess('Traspaso registrado correctamente');
    } catch (error) {
      swalClose();
      throw handleError(error);
    }
  };

  return {
    dataTransfers,
    getTransfers,
    createTransfer,
  };
};
