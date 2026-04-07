import { useState, type FormEvent } from 'react';
import { Button, InputCustom } from '@/components';
import type { TransferRequestModel, DispatchTransferRequestBody } from '@/models';

interface Props {
  request: TransferRequestModel;
  handleClose: () => void;
  onDispatch: (id: string, body: DispatchTransferRequestBody) => Promise<void>;
}

interface DispatchItem {
  itemId: string;
  productName: string;
  quantityRequested: number;
  quantityDispatched: number;
}

export const TransferRequestDispatch = ({ request, handleClose, onDispatch }: Props) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [note, setNote] = useState('');
  const [dispatchItems, setDispatchItems] = useState<DispatchItem[]>(
    request.items.map((item) => ({
      itemId: item.id,
      productName: item.product.name,
      quantityRequested: item.quantityRequested,
      quantityDispatched: item.quantityRequested,
    })),
  );

  const handleUpdateQty = (index: number, value: number) => {
    setDispatchItems((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], quantityDispatched: value };
      return updated;
    });
  };

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);

    const hasInvalid = dispatchItems.some(
      (i) => i.quantityDispatched < 0 || i.quantityDispatched > i.quantityRequested,
    );
    if (hasInvalid) return;

    const body: DispatchTransferRequestBody = {
      note: note.trim() || undefined,
      items: dispatchItems.map((i) => ({
        itemId: i.itemId,
        quantityDispatched: i.quantityDispatched,
      })),
    };

    await onDispatch(request.id, body);
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-4 z-10">
          <h2 className="text-lg sm:text-xl font-bold">Despachar Solicitud</h2>
          <p className="text-sm text-gray-500">
            De <span className="font-medium">{request.fromBranch.name}</span> hacia <span className="font-medium">{request.toBranch.name}</span>
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <form onSubmit={sendSubmit} className="space-y-4">
            {request.note && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg px-4 py-2">
                <p className="text-sm text-blue-700"><span className="font-medium">Nota del solicitante:</span> {request.note}</p>
              </div>
            )}

            <InputCustom
              multiline
              name="note"
              value={note}
              label="Nota de despacho (opcional)"
              onChange={(e) => setNote(e.target.value)}
              error={false}
            />

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Cantidades a despachar:</p>
              {dispatchItems.map((item, i) => {
                const error =
                  formSubmitted && (item.quantityDispatched < 0 || item.quantityDispatched > item.quantityRequested)
                    ? item.quantityDispatched < 0
                      ? 'No puede ser negativo'
                      : `Máx. ${item.quantityRequested}`
                    : '';
                return (
                  <div key={item.itemId} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800">{item.productName}</p>
                      <p className="text-xs text-gray-400">Solicitado: {item.quantityRequested}</p>
                    </div>
                    <div className="w-32 shrink-0">
                      <InputCustom
                        name={`dispatch-${i}`}
                        value={item.quantityDispatched}
                        label="A despachar"
                        type="number"
                        onChange={(e) => handleUpdateQty(i, Number(e.target.value))}
                        error={!!error}
                        helperText={error}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" color="bg-gray-400" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" color="bg-amber-500">
                Despachar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
