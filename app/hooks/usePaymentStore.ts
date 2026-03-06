import { coffeApi } from '@/services';
import { setClearCart } from '@/store';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type CartRequest, type InvoiceModel, type PaymentModel } from '@/models';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const usePaymentStore = () => {
  const [dataPayment, setDataPayment] = useState<BaseResponse<PaymentModel>>(InitBaseResponse);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const { showSuccess, showLoading, swalClose } = useAlertStore();

  const baseUrl = 'order';

  const getPayments = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);

      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<PaymentModel> = {
        ...meta,
        data,
      };

      setDataPayment(payload);
    } catch (error) {
      throw handleError(error);
    }
  }

  const sentPayments = async (body: CartRequest) => {
    try {
      showLoading('Registrando reserva');
      await coffeApi.post(`/${baseUrl}`, body);
      swalClose();
      showSuccess('Reserva registrada');
      dispatch(setClearCart());
    } catch (error: any) {
      swalClose();
      throw handleError(error);
    }
  }

  return {
    //* Propiedades
    dataPayment,
    //* Métodos
    getPayments,
    sentPayments,
  }
}