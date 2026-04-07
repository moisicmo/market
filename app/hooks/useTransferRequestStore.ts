import { useState } from 'react';
import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore, usePrintStore } from '.';
import {
  InitBaseResponse,
  type BaseResponse,
  type TransferRequestModel,
  type CreateTransferRequestBody,
  type DispatchTransferRequestBody,
  type ReceiveTransferRequestBody,
  type RejectTransferRequestBody,
} from '@/models';

export const useTransferRequestStore = () => {
  const { handleError } = useErrorStore();
  const { showLoading, swalClose, showSuccess } = useAlertStore();
  const { handlePdf } = usePrintStore();
  const baseUrl = 'transfer-request';

  const [dataRequests, setDataRequests] = useState<BaseResponse<TransferRequestModel>>(
    InitBaseResponse<TransferRequestModel>(),
  );

  const getRequests = async (page = 1, limit = 10, branchId = '', keys = '', status = '') => {
    try {
      const res = await coffeApi.get(
        `/${baseUrl}?page=${page}&limit=${limit}&branchId=${branchId}&keys=${keys}&status=${status}`,
      );
      const { data, meta } = res.data;
      setDataRequests({ ...meta, data });
    } catch (error) {
      throw handleError(error);
    }
  };

  const createRequest = async (body: CreateTransferRequestBody): Promise<void> => {
    try {
      showLoading('Creando solicitud...');
      await coffeApi.post(`/${baseUrl}`, body);
      swalClose();
      showSuccess('Solicitud creada correctamente');
    } catch (error) {
      swalClose();
      throw handleError(error);
    }
  };

  const dispatchRequest = async (id: string, body: DispatchTransferRequestBody): Promise<void> => {
    try {
      showLoading('Despachando solicitud...');
      await coffeApi.patch(`/${baseUrl}/${id}/dispatch`, body);
      swalClose();
      showSuccess('Solicitud despachada correctamente');
    } catch (error) {
      swalClose();
      throw handleError(error);
    }
  };

  const receiveRequest = async (id: string, body: ReceiveTransferRequestBody): Promise<void> => {
    try {
      showLoading('Recibiendo solicitud...');
      await coffeApi.patch(`/${baseUrl}/${id}/receive`, body);
      swalClose();
      showSuccess('Solicitud recibida correctamente');
    } catch (error) {
      swalClose();
      throw handleError(error);
    }
  };

  const rejectRequest = async (id: string, body: RejectTransferRequestBody): Promise<void> => {
    try {
      showLoading('Rechazando solicitud...');
      await coffeApi.patch(`/${baseUrl}/${id}/reject`, body);
      swalClose();
      showSuccess('Solicitud rechazada');
    } catch (error) {
      swalClose();
      throw handleError(error);
    }
  };

  const downloadPdf = async (id: string) => {
    try {
      const { data } = await coffeApi.get(`/${baseUrl}/${id}/pdf`);
      await handlePdf(data.pdfBase64);
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    dataRequests,
    getRequests,
    createRequest,
    dispatchRequest,
    receiveRequest,
    rejectRequest,
    downloadPdf,
  };
};
