import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { type ProductPresentationModel, type ProductPresentationRequest } from '@/models';

export const useProductPresentationStore = () => {
  const { handleError } = useErrorStore();
  const { showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'product/presentation';

  const createProductPresentation = async ( body: ProductPresentationRequest ): Promise<ProductPresentationModel> => {
    try {
      const res = await coffeApi.post(`${baseUrl}`, body);
      const data = res.data as ProductPresentationModel;
      showSuccess("Presentación creada correctamente");
      return data;
    } catch (error) {
      throw handleError(error);
    }
  };

  const updateProductPresentation = async (id: string, body: ProductPresentationRequest) => {
    try {
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      // getProducts();
      showSuccess('Presentación editado correctamente');
    } catch (error) {
      throw handleError(error);
    }
  };
  const deleteProductPresentation = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        await coffeApi.delete(`/${baseUrl}/${id}`);
        // getProducts();
        showSuccess('Presentación eliminado correctamente');
      } else {
        showError('Cancelado', 'El módulo esta a salvo :)');
      }
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Métodos
    // getProducts,
    createProductPresentation,
    updateProductPresentation,
    deleteProductPresentation,
  };
};
