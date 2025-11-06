import type { DebtModel } from "./debt.response";


interface inscriptionData {
  month: string;
  count: number;
}


export interface DashboardModel {
  ordersData: inscriptionData[];
  metrics: {
    totalBranches: number;
    totalOrders: number;
    totalProducts: number;
    totalCustomers: number;
  };
}

export const initDashboardModel:DashboardModel = {
  ordersData: [],
  metrics:{
    totalBranches: 0,
    totalOrders: 0,
    totalProducts: 0,
    totalCustomers: 0,
  }
}