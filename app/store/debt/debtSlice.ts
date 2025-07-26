import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { InitBaseResponse, type BaseResponse, type DebtModel } from '@/models';



const dataByStudent: BaseResponse<DebtModel> = InitBaseResponse<DebtModel>();

export const debtSlice = createSlice({
  name: 'debt',
  initialState: {
    dataDebtByStudent: dataByStudent,
  },
  reducers: {
    setDebtsByStudent: (state, action: PayloadAction<BaseResponse<DebtModel>>) => {
      state.dataDebtByStudent = action.payload;
    },
    updateDebtByStudent: (state, action: PayloadAction<DebtModel>) => {
      // Encuentra el índice del elemento que necesitas actualizar
      const index = state.dataDebtByStudent.data.findIndex(debt => debt.id === action.payload.id);

      // Si el elemento existe, actualiza ese elemento específico
      if (index !== -1) {
        state.dataDebtByStudent.data[index] = action.payload;
      }
    },
  }
});

// Action creators are generated for each case reducer function
export const { setDebtsByStudent, updateDebtByStudent } = debtSlice.actions;