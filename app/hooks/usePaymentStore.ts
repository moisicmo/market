import { coffeApi } from '@/services';
import { setClearCart, updateDebtByStudent } from '@/store';
import { useAlertStore, useErrorStore, usePrintStore } from '.';
import { InitBaseResponse, type BaseResponse, type CartRequest, type InvoiceModel, type PaymentModel } from '@/models';
import { useState } from 'react';
import { useDispatch } from 'react-redux';

export const usePaymentStore = () => {
  const [dataPayment, setDataPayment] = useState<BaseResponse<PaymentModel>>(InitBaseResponse);
  const dispatch = useDispatch();
  const { handleError } = useErrorStore();
  const { showLoading, swalClose } = useAlertStore();
  const { handlePdf } = usePrintStore();

  const baseUrl = 'payment';

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
      showLoading('Registrando los pago(s)..');
      const res = await coffeApi.post(`/${baseUrl}/sendings`, body);
      const { finalInvoice, pdfBase64 } = res.data;
      const invoice: InvoiceModel = finalInvoice;
      invoice.payments.forEach(payment => {
        dispatch(updateDebtByStudent(payment.debt));
      });
      swalClose();
      await handlePdf(pdfBase64);
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