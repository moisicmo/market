import { useState } from 'react';
import type { DebtModel, FormPaymentModel, ProductPresentationModel } from "@/models";
import { useEnums } from "@/hooks";
import { ActionButtons, Button, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import React from "react";

interface Props {
  productId: string;
  productPresentations: ProductPresentationModel[];
  handleEdit: (presentation: ProductPresentationModel) => void;
  onDelete: (id: string) => void;
  onCreate: () => void;
}

export const ProductPresentationTable = (props: Props) => {
  const {
    productId,
    productPresentations,
    handleEdit,
    onDelete,
    onCreate,
  } = props;

  const { getTypeDebt, getTypeDebtClass } = useEnums();
  const [Debt, setDebt] = useState<FormPaymentModel | null>(null);
  const [expandedId, setExpandedId] = useState<string | null>(null);


  const handleSelect = async (debt: DebtModel) => {
    if (debt.payments.length === 0) return;
    if (expandedId === debt.id) {
      // Si ya está abierto, ciérralo
      setExpandedId(null);
      return;
    }
    setExpandedId(debt.id);
  };



  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm font-semibold text-gray-900">Presentaciones:</p>
        <Button
          onClick={() => onCreate()}
        >Nueva Presentación</Button>
      </div>
      <Table className='mb-3'>
        <TableHeader>
          <TableRow>
            <TableHead>Sucursal</TableHead>
            <TableHead>Precio</TableHead>
            <TableHead className="sticky right-0 z-10 bg-white">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {productPresentations.map(presentation => (
            <React.Fragment key={presentation.id}>
              <TableRow>
                <TableCell>{`${presentation.branch.name}`}</TableCell>
                <TableCell>{`${presentation.prices[0].price} Bs`}</TableCell>

                {/* <TableCell>
                    {format(new Date(presentation.createdAt), 'dd-MMMM-yyyy HH:mm', { locale: es })}
                  </TableCell>
                  <TableCell>
                    {presentation.dueDate ? format(new Date(presentation.dueDate), 'dd-MMMM-yyyy', { locale: es }) : '—'}
                  </TableCell> */}
                <TableCell className="sticky right-0 z-10 bg-white">
                  <ActionButtons
                    item={presentation}
                    // onSelect={() => handleSelect(presentation)}
                    isSelected={expandedId === presentation.id}
                    // onPayment={() => {
                    //   const request: FormPaymentModel = {
                    //     debt: presentation,
                    //     amount: presentation.remainingBalance,
                    //     dueDate: null,
                    //   };
                    //   setDebt(request);
                    // }}
                    isPopoverOpen={Debt?.debt.id == presentation.id}
                    onEdit={handleEdit}
                    onDelete={onDelete}
                  >
                    {/* {Debt && (
                        <PaymentCreate item={Debt} onClose={() => setDebt(null)} />
                      )} */}
                  </ActionButtons>

                </TableCell>
              </TableRow>
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </>
  )
}
