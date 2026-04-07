import { useDispatch } from 'react-redux';
import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type BrandModel, type BrandRequest } from '@/models';
import { useState } from 'react';

export const useBrandStore = () => {
  const [dataBrand, setDataBrand] = useState<BaseResponse<BrandModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { showLoading, swalClose, showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'brand';

  const getBrands = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<BrandModel> = {
        ...meta,
        data,
      };
      setDataBrand(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const createBrand = async (body: BrandRequest) => {
    try {
      showLoading('Creando marca...');
      const { data } = await coffeApi.post(`${baseUrl}`, body);
      console.log(data);
      getBrands();
      swalClose();
      showSuccess('Marca creada correctamente');
    } catch (error) {
      swalClose();
      throw handleError(error);
    }
  };
  const updateBrand = async (id: string, body: BrandRequest) => {
    try {
      showLoading('Editando marca...');
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      getBrands();
      swalClose();
      showSuccess('Marca editada correctamente');
    } catch (error) {
      swalClose();
      throw handleError(error);
    }
  };
  const deleteBrand = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        showLoading('Eliminando marca...');
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getBrands();
        swalClose();
        showSuccess('Marca eliminada correctamente');
      } else {
        showError('Cancelado', 'La marca esta a salvo :)');
      }
    } catch (error) {
      swalClose();
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataBrand,
    //* Métodos
    getBrands,
    createBrand,
    updateBrand,
    deleteBrand,
  };
};
