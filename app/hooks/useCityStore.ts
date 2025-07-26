import { coffeApi } from '@/services';
import { useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type CityModel } from '@/models';
import { useState } from 'react';

export const useCityStore = () => {
  const [dataCity, setDataCity] = useState<BaseResponse<CityModel>>(InitBaseResponse);

  const { handleError } = useErrorStore();
  const baseUrl = 'city';

  const getCityes = async (page: number = 1, limit: number = 10, keys: string = '') => {

    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<CityModel> = {
        ...meta,
        data,
      };
      setDataCity(payload);
    } catch (error) {
      throw handleError(error);
    }

  }

  return {
    //* Propiedades
    dataCity,
    //* Métodos
    getCityes,
  }
}