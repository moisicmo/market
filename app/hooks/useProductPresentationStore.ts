import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { type ProductPresentationModel, type ProductPresentationRequest } from '@/models';

export const useProductPresentationStore = () => {
  const { handleError } = useErrorStore();
  const { showLoading, swalClose, showSuccess, showWarning, showError } = useAlertStore();
  const baseUrl = 'product/presentation';

  const createProductPresentation = async ( body: ProductPresentationRequest ): Promise<ProductPresentationModel> => {
    try {
      showLoading('Creando presentación...');
      const res = await coffeApi.post(`${baseUrl}`, body);
      const data = res.data as ProductPresentationModel;
      swalClose();
      showSuccess("Presentación creada correctamente");
      return data;
    } catch (error) {
      swalClose();
      throw handleError(error);
    }
  };

  const updateProductPresentation = async (id: string, body: ProductPresentationRequest) => {
    try {
      showLoading('Editando presentación...');
      const { data } = await coffeApi.patch(`/${baseUrl}/${id}`, body);
      console.log(data);
      swalClose();
      showSuccess('Presentación editado correctamente');
    } catch (error) {
      swalClose();
      throw handleError(error);
    }
  };
  const deleteProductPresentation = async (id: string) => {
    try {
      const result = await showWarning();
      if (result.isConfirmed) {
        showLoading('Eliminando presentación...');
        await coffeApi.delete(`/${baseUrl}/${id}`);
        swalClose();
        showSuccess('Presentación eliminado correctamente');
      } else {
        showError('Cancelado', 'El módulo esta a salvo :)');
      }
    } catch (error) {
      swalClose();
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
