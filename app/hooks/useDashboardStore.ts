import { coffeApi } from '@/services';
import { useErrorStore } from '.';
import type { DashboardModel } from '@/models';

export const useDashboardStore = () => {
  const { handleError } = useErrorStore();
  const baseUrl = 'dashboard';

  const getData = async () => {

    try {
      const { data } = await coffeApi.get(`/${baseUrl}`);
      console.log(data);
      const payload: DashboardModel = data;
      console.log(payload);
      return payload;
    } catch (error) {
      throw handleError(error);
    }

  }

  return {
    getData,
  }
}