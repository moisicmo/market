import { coffeApi } from '@/services';
import { useAlertStore, useErrorStore } from '.';
import { type InputRequest, type Movement } from '@/models';

export const useInputStore = () => {
  const { handleError } = useErrorStore();
  const { showSuccess } = useAlertStore();
  const baseUrl = 'input';

  const createInput = async (body: InputRequest) : Promise<Movement[]> => {
    try {
      console.log(body);
      const { data } = await coffeApi.post(`${baseUrl}`, body);
      console.log(data);
      showSuccess('Creado correctamente');
      return data;
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    //* Métodos
    createInput,
  };
};
