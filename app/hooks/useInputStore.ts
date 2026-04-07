import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { type InputRequest, type Movement } from '@/models';

export const useInputStore = () => {
  const { handleError } = useErrorStore();
  const { showLoading, swalClose, showSuccess } = useAlertStore();
  const baseUrl = 'input';

  const createInput = async (body: InputRequest) : Promise<Movement[]> => {
    try {
      showLoading('Creando ingreso...');
      console.log(body);
      const { data } = await coffeApi.post(`${baseUrl}`, body);
      console.log(data);
      swalClose();
      showSuccess('Creado correctamente');
      return data;
    } catch (error) {
      swalClose();
      throw handleError(error);
    }
  };

  return {
    //* Métodos
    createInput,
  };
};
