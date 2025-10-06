import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { type TransferRequest, type TransferResponse } from '@/models';

export const useTransferStore = () => {
  const { handleError } = useErrorStore();
  const { showSuccess } = useAlertStore();
  const baseUrl = 'transfer';

  const createTransfer = async (body: TransferRequest) : Promise<TransferResponse[]> => {
    try {
      console.log(body);
      const { data } = await coffeApi.post(`${baseUrl}`, body);
      console.log(data);
      showSuccess('Transferido correctamente');
      return data;
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Métodos
    createTransfer,
  };
};
