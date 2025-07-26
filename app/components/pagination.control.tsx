import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  total: number;
  page: number;
  limit: number;
  onPageChange: (value: number) => void;
  onRowsPerPageChange: (value: number) => void;
}

export const PaginationControls = (props: Props) => {
  const {
    total,
    page,
    limit,
    onPageChange,
    onRowsPerPageChange,
  } = props;
  const totalPages = useMemo(() => Math.ceil(total / limit), [total, limit]);

  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  return (
    <div className="flex justify-end items-center text-sm px-4 py-3">
      <div className="flex items-center space-x-6">
        {/* Dropdown de cantidad */}
        <div className="flex items-center space-x-2">
          <span>Filas por página:</span>
          <select
            value={limit}
            onChange={(e) => onRowsPerPageChange(Number(e.target.value))}
            className="bg-transparent border-none focus:outline-none"
          >
            {[5, 10, 25].map((n) => (
              <option key={n} value={n} className="text-black">
                {n}
              </option>
            ))}
          </select>
        </div>

        {/* Rango */}
        <>
          {from}–{to} de {total}
        </>

        {/* Botones de navegación */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            className="disabled:text-gray-500 hover:text-gray-300 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            className="disabled:text-gray-500 hover:text-gray-300 disabled:cursor-not-allowed"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
