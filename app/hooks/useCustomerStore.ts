import { useState } from 'react';
import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type CustomerModel, type CustomerRequest } from '@/models';


export const useCustomerStore = () => {
  const [dataCustomer, setDataCustomer] = useState<BaseResponse<CustomerModel>>(InitBaseResponse);

  const { handleError } = useErrorStore();
  const { showLoading, swalClose, showSuccess, showWarning, showError } = useAlertStore();
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

  const createCustomer = async (body: CustomerRequest): Promise<CustomerModel | null> => {
    try {
      showLoading('Creando cliente...');
      const { data } = await coffeApi.post(`/${baseUrl}/`, body);
      await getCustomers();
      swalClose();
      showSuccess('Cliente creado correctamente');
      // data is the user object from the backend — build CustomerModel shape
      return { userId: data.id, user: data } as CustomerModel;
    } catch (error) {
      swalClose();
      handleError(error);
      return null;
    }
  };

  const updateCustomer = async (id: string, body: CustomerRequest) => {
    try {
      showLoading('Editando cliente...');
      await coffeApi.patch(`/${baseUrl}/${id}`, body);
      await getCustomers();
      swalClose();
      showSuccess('Cliente editado correctamente');
    } catch (error) {
      swalClose();
      throw handleError(error);
    }
  };

  const deleteCustomer = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        showLoading('Eliminando cliente...');
        await coffeApi.delete(`/${baseUrl}/${id}`);
        await getCustomers();
        swalClose();
        showSuccess('Cliente eliminado correctamente');
      } else {
        showError('Cancelado', 'El Cliente está a salvo :)');
      }
    } catch (error) {
      swalClose();
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
