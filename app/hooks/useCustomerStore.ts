import { useState } from 'react';
import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type CustomerModel, type CustomerRequest } from '@/models';


export const useCustomerStore = () => {
  const [dataCustomer, setDataCustomer] = useState<BaseResponse<CustomerModel>>(InitBaseResponse);

  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'customer';

  const getCustomers = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(data);
      const payload: BaseResponse<CustomerModel> = {
        ...meta,
        data,
      };
      setDataCustomer(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const createCustomer = async (body: CustomerRequest) => {
    try {
      await coffeApi.post(`/${baseUrl}/`, body);
      await getCustomers();
      showSuccess('Customer creado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };

  const updateCustomer = async (id: string, body: CustomerRequest) => {
    try {
      await coffeApi.patch(`/${baseUrl}/${id}`, body);
      await getCustomers();
      showSuccess('Customer editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        await getCustomers();
        showSuccess('Customer eliminado correctamente');
      } else {
        showError('Cancelado', 'El Customer está a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataCustomer,
    //* Métodos
    getCustomers,
    createCustomer,
    updateCustomer,
    deleteCustomer,
  };
};
