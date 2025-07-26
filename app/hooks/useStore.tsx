
import type { store } from '@/store';
import { type TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

// 🔁 Tipos globales basados en toda la configuración del store
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// ✅ Hooks tipados reutilizables
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
