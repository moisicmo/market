import type { Movement } from "@/models";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface Props {
  moviments: Movement[];
}

export const MovimentsTable = ({ moviments }: Props) => {
  return (
    <div className="rounded-lg border border-slate-200 shadow-sm overflow-hidden">
      <Table className="w-full text-sm text-gray-700">
        <TableHeader>
          <TableRow className="bg-slate-50">
            <TableHead>Tenias</TableHead>
            <TableHead>Movimiento</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Razón</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead>Fecha de registro</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {moviments.map((moviment, i) => {
            const isInput = !!moviment.input;
            const detail = moviment.input?.detail ?? moviment.output?.detail;
            const quantity =
              moviment.input?.quantity ?? moviment.output?.quantity;
            const price = moviment.input?.price ?? moviment.output?.price;
            const date = moviment.input?.createdAt ?? moviment.output?.createdAt;
            const previousStock = isInput
              ? moviment.stock - (moviment.input?.quantity ?? 0)
              : moviment.stock + (moviment.output?.quantity ?? 0);

            return (
              <TableRow
                key={i}
                className={`transition ${isInput
                  ? "hover:bg-amber-50/50"
                  : "hover:bg-emerald-50/50"

                  }`}
              >
                <TableCell>{previousStock}</TableCell>
                <TableCell className="flex items-center gap-2">
                  <span
                    className={`font-medium ${isInput ? "text-amber-400" : "text-emerald-600"
                      }`}
                  >
                    {isInput ? "+" : "-"}
                    {quantity}
                  </span>
                </TableCell>
                <TableCell>{moviment.stock}</TableCell>

                <TableCell>
                  <span
                    className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${isInput
                      ? "bg-amber-100 text-amber-400"
                      : "bg-emerald-100 text-emerald-700"

                      }`}
                  >
                    {detail}
                  </span>
                </TableCell>

                <TableCell>{price} Bs.</TableCell>

                <TableCell>
                  {format(new Date(date ?? Date.now()), "dd-MMMM-yyyy HH:mm", {
                    locale: es,
                  })}
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
};
