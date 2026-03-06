import { useState } from 'react';
import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore, usePrintStore } from '.';
import { InitBaseResponse, type BaseResponse, type OrderModel } from '@/models';

export const useOrderStore = () => {
  const { handleError } = useErrorStore();
  const { showLoading, swalClose } = useAlertStore();
  const { handlePdf } = usePrintStore();
  const baseUrl = 'order';

  const [dataOrders, setDataOrders] = useState<BaseResponse<OrderModel>>(InitBaseResponse<OrderModel>());

  const getOrders = async (page = 1, limit = 10, branchId = '', keys = '', status = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&branchId=${branchId}&keys=${keys}&status=${status}`);
      const { data, meta } = res.data;
      setDataOrders({ ...meta, data });
    } catch (error) {
      throw handleError(error);
    }
  };

  const confirmSale = async (id: string) => {
    try {
      showLoading('Confirmando venta...');
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}/confirm`);
      swalClose();
      if (data.pdfBase64) {
        await handlePdf(data.pdfBase64);
      }
    } catch (error) {
      swalClose();
      throw handleError(error);
    }
  };

  const annulOrder = async (id: string) => {
    try {
      showLoading('Anulando orden...');
      await coffeApi.patch(`/${baseUrl}/${id}/annul`);
      swalClose();
    } catch (error) {
      swalClose();
      throw handleError(error);
    }
  };

  const reprintPdf = async (id: string) => {
    try {
      const { data } = await coffeApi.get(`/${baseUrl}/${id}/pdf`);
      await handlePdf(data.pdfBase64);
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    dataOrders,
    getOrders,
    confirmSale,
    annulOrder,
    reprintPdf,
  };
};
