import { coffeApi } from '@/services';
import { useErrorStore } from './useError';
import { usePermissionStore } from './usePermissionStore';
import { TypeAction, TypeSubject } from '@/models';


export const useReportStore = () => {
  const { handleError } = useErrorStore();
  const { requirePermission } = usePermissionStore();

  const getReportInventories = async (startDate: string, endDate: string) => {
    try {
      requirePermission(TypeAction.read, TypeSubject.report);
      const res = await coffeApi.get('/report/inventory', {
        params: { startDate, endDate },
      });
      return res.data as { xlsxBase64: string; data: any[] };
    } catch (error) {
      throw handleError(error);
    }
  };

  const getReportSales = async (startDate: string, endDate: string) => {
    try {
      requirePermission(TypeAction.read, TypeSubject.report);
      const res = await coffeApi.get('/report/sale', {
        params: { startDate, endDate },
      });
      return res.data as { xlsxBase64: string; data: any[] };
    } catch (error) {
      throw handleError(error);
    }
  };

  return {
    getReportInventories,
    getReportSales,
  };
};