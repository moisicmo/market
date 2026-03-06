import { useState } from 'react';
import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore, usePrintStore } from '.';
import {
  InitBaseResponse,
  type BaseResponse,
  type PayableModel,
  type PurchaseModel,
  type PurchaseRequest,
  type Movement,
} from '@/models';

export const usePurchaseStore = () => {
  const { handleError } = useErrorStore();
  const { showSuccess } = useAlertStore();
  const { handlePdf } = usePrintStore();
  const baseUrl = 'purchase';

  const [dataPurchase, setDataPurchase] = useState<BaseResponse<PurchaseModel>>(InitBaseResponse<PurchaseModel>());
  const [dataPayables, setDataPayables] = useState<BaseResponse<PayableModel>>(InitBaseResponse<PayableModel>());

  const getPurchases = async (page = 1, limit = 10, keys = '', branchId = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}&branchId=${branchId}`);
      const { data, meta } = res.data;
      setDataPurchase({ ...meta, data });
    } catch (error) {
      throw handleError(error);
    }
  };

  const createPurchase = async (body: PurchaseRequest): Promise<Movement[]> => {
    try {
      const { data } = await coffeApi.post(`/${baseUrl}`, body);
      const { kardexLists, pdfBase64 } = data;
      showSuccess('Compra registrada correctamente');
      await handlePdf(pdfBase64);
      return kardexLists;
    } catch (error) {
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

  const getPayables = async (page = 1, limit = 10, branchId = '', keys = '', status = '') => {
    try {
      const res = await coffeApi.get(
        `/${baseUrl}/payables?page=${page}&limit=${limit}&branchId=${branchId}&keys=${keys}&status=${status}`,
      );
      const { data, meta } = res.data;
      setDataPayables({ ...meta, data });
    } catch (error) {
      throw handleError(error);
    }
  };

  const payInstallment = async (id: string) => {
    try {
      await coffeApi.patch(`/${baseUrl}/installments/${id}/pay`);
      showSuccess('Cuota registrada como pagada');
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    dataPurchase,
    dataPayables,
    getPurchases,
    createPurchase,
    reprintPdf,
    getPayables,
    payInstallment,
  };
};
