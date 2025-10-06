import type { BaseResponse, BranchModel, InputRequest, TransferRequest } from '@/models';
import { Card, CardContent } from '@/components/ui/card';
import React, { useEffect, useRef, useState } from 'react';
import { PresentationTable } from '.';
import { useKardexStore, useTransferStore } from '@/hooks';
import { useInputStore } from '@/hooks/useInputStore';

interface Props {
  dataBranch: BaseResponse<BranchModel>;
}

export const BranchList = ({ dataBranch }: Props) => {
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const { dataKardexPresentation, getPresentationsByBranchId, updatePresentations } = useKardexStore();
  const { createInput } = useInputStore();
  const { createTransfer } = useTransferStore();
  const initialized = useRef(false);

  const handleSelect = async (id: string) => {
    if (expandedId === id) {
      setExpandedId(null);
      return;
    }

    setExpandedId(id);
    await getPresentationsByBranchId(id);
  };

  useEffect(() => {
    if (!initialized.current && dataBranch.total === 1) {
      initialized.current = true;
      handleSelect(dataBranch.data[0].id);
    }
  }, [dataBranch]);


  const handleCreateInput = async (inputRequest: InputRequest) => {
    const moviments = await createInput(inputRequest);
    updatePresentations(moviments);
  }


  const handleCreateTransfer = async (transferRequest: TransferRequest) => {
    const transfers = await createTransfer(transferRequest);

    // Agrupamos todos los movimientos
    const allMovements = transfers.map(element => ({
      stock: element.from.stock,
      output: element.from.output,
      input: null,
    }));

    // Una sola actualización final
    updatePresentations(allMovements);
  };


  return (
    <div className="space-y-4">
      {dataBranch.data.map((branch) => (
        <React.Fragment key={branch.id}>
          <Card
            className="flex gap-4 p-4 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div
              className="flex items-center"
              onClick={() => handleSelect(branch.id)}
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xl font-bold text-primary">
                  {branch.name.charAt(0).toUpperCase()}
                </span>
              </div>
              <CardContent className="p-0">
                <h3 className="text-base font-semibold text-gray-800">{branch.name}</h3>
                <p className="text-sm text-gray-500">{branch.address}</p>
              </CardContent>
            </div>

            {expandedId === branch.id && (
              <div className="rounded-md border border-slate-300 bg-white p-4 shadow-sm">
                <PresentationTable
                  branchId={branch.id}
                  dataKardex={dataKardexPresentation}
                  onInputCreate={handleCreateInput}
                  onTransferCreate={handleCreateTransfer}
                  dataBranch={dataBranch}
                />
              </div>
            )}
          </Card>
        </React.Fragment>
      ))}
    </div>
  );
};
