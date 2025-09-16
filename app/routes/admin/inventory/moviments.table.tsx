import type { Movement } from "@/models";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components";
interface Props {
  moviments: Movement[];
}

export const MovimentsTable = (props: Props) => {
  const {
    moviments,
  } = props;

  return (
    <>
      <Table className="w-full text-sm text-gray-700">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Stock</TableHead>
            <TableHead>Cantidad</TableHead>
            <TableHead>Detalle</TableHead>
            <TableHead>Precio</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {moviments.map((moviment,i) => (
            <TableRow key={i}>
              <TableCell>{moviment.stock}</TableCell>
              <TableCell>{moviment.input.quantity}</TableCell>
              <TableCell>{moviment.input.detail}</TableCell>
              <TableCell>{moviment.input.price}</TableCell>

            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
