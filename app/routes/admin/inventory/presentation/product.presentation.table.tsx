import type { ProductPresentationModel } from "@/models";
import { ActionButtons, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components";
interface Props {
  productPresentations: ProductPresentationModel[];
  handleEdit: (presentation: ProductPresentationModel) => void;
  onDelete: (id: string) => void;
}

export const ProductPresentationTable = (props: Props) => {
  const {
    productPresentations,
    handleEdit,
    onDelete,
  } = props;

  return (
    <>
      <Table className="w-full text-sm text-gray-700">
        <TableHeader>
          <TableRow className="bg-gray-100">
            <TableHead>Nombre</TableHead>
            <TableHead>Sucursal</TableHead>
            <TableHead>Tipo de unidad</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead className="sticky right-0 bg-gray-100 z-10">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productPresentations.map((presentation) => (
            <TableRow key={presentation.id}>
              <TableCell>{presentation.name}</TableCell>
              <TableCell>{presentation.branch.name}</TableCell>
              <TableCell>{presentation.typeUnit}</TableCell>
              <TableCell>{presentation.prices[0].price} Bs</TableCell>
              <TableCell className="sticky right-0 bg-white z-10">
                <ActionButtons
                  item={presentation}
                  onEdit={handleEdit}
                  onDelete={onDelete}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
