import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { InitBaseResponse, type BaseResponse, type ProductModel, type ProductRequest } from '@/models';
import { useState } from 'react';

export const useProductStore = () => {
  const [dataProduct, setDataProduct] = useState<BaseResponse<ProductModel>>(InitBaseResponse);
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'product';

  const getProducts = async (page: number = 1, limit: number = 10, keys: string = '') => {
    try {
      const res = await coffeApi.get(`/${baseUrl}?page=${page}&limit=${limit}&keys=${keys}`);
      const { data, meta } = res.data;
      console.log(res.data);
      const payload: BaseResponse<ProductModel> = {
        ...meta,
        data,
      };
      setDataProduct(payload);
    } catch (error) {
      throw handleError(error);
    }
  };

  const createProduct = async (body: ProductRequest, image: File | null) => {
    try {
      console.log(body);
      const formData = new FormData();

      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== "prices" && key !== "unitConversion") {
          formData.append(key, value as string);
        }
      });

      formData.append('prices', JSON.stringify(body.prices));
      formData.append('unitConversion', JSON.stringify(body.unitConversion));

      if (image) {
        formData.append("image", image);
      }
      const { data } = await coffeApi.post(`${baseUrl}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log(data);
      getProducts();
      showSuccess('Producto creado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };

  const updateProduct = async (id: string, body: ProductRequest, image: File | null) => {
    try {
      console.log(body);
      const formData = new FormData();

      Object.entries(body).forEach(([key, value]) => {
        if (value !== undefined && value !== null && key !== "prices" && key !== "unitConversion") {
          formData.append(key, value as string);
        }
      });
      formData.append('prices', JSON.stringify(body.prices));
      formData.append('unitConversion', JSON.stringify(body.unitConversion));

      if (image) {
        formData.append("image", image);
      }
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(data);
      getProducts();
      showSuccess('Producto editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteProduct = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        getProducts();
        showSuccess('Producto eliminado correctamente');
      } else {
        showError('Cancelado', 'El módulo esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  const importXlsx = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      await coffeApi.post(`/${baseUrl}/import`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      getProducts();
      showSuccess('Archivo importado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Propiedades
    dataProduct,
    //* Métodos
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    importXlsx,
  };
};
