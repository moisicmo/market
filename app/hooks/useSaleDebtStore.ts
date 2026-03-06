import { useState } from 'react';
import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type SaleDebtModel, type SalePaymentRequest } from '@/models';

export const useSaleDebtStore = () => {
  const { handleError } = useErrorStore();
  const { showSuccess } = useAlertStore();
  const baseUrl = 'sale-debt';

  const [dataSaleDebts, setDataSaleDebts] = useState<BaseResponse<SaleDebtModel>>(InitBaseResponse<SaleDebtModel>());

  const getSaleDebts = async (page = 1, limit = 10, branchId = '', keys = '', status = '') => {
    try {
      const res = await coffeApi.get(
        `/${baseUrl}?page=${page}&limit=${limit}&branchId=${branchId}&keys=${keys}&status=${status}`,
      );
      const { data, meta } = res.data;
      setDataSaleDebts({ ...meta, data });
    } catch (error) {
      throw handleError(error);
    }
  };

  const addPayment = async (id: string, body: SalePaymentRequest) => {
    try {
      await coffeApi.post(`/${baseUrl}/${id}/payment`, body);
      showSuccess('Pago registrado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    dataSaleDebts,
    getSaleDebts,
    addPayment,
  };
};
