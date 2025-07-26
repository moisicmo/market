import type { DebtModel } from "./debt.response";


interface inscriptionData {
  month: string;
  count: number;
}


export interface DashboardModel {
  debts: DebtModel[];
  inscriptionsData: inscriptionData[];
  metrics: {
    totalBranches: number;
    totalDebts: number;
    totalPayments: number;
    totalStudents: number;
    totalTeachers: number;
  };
}

export const initDashboardModel:DashboardModel = {
  debts:[],
  inscriptionsData: [],
  metrics:{
    totalBranches: 0,
    totalDebts: 0,
    totalPayments: 0,
    totalStudents: 0,
    totalTeachers: 0,
  }
}