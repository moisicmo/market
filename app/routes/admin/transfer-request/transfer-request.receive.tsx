import { useState, type FormEvent } from 'react';
import { Button, InputCustom } from '@/components';
import type { TransferRequestModel, ReceiveTransferRequestBody } from '@/models';

interface Props {
  request: TransferRequestModel;
  handleClose: () => void;
  onReceive: (id: string, body: ReceiveTransferRequestBody) => Promise<void>;
}

export const TransferRequestReceive = ({ request, handleClose, onReceive }: Props) => {
  const [observationNote, setObservationNote] = useState('');

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const body: ReceiveTransferRequestBody = {
      observationNote: observationNote.trim() || undefined,
    };

    await onReceive(request.id, body);
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-4 z-10">
          <h2 className="text-lg sm:text-xl font-bold">Recibir Solicitud</h2>
          <p className="text-sm text-gray-500">
            De <span className="font-medium">{request.fromBranch.name}</span> hacia <span className="font-medium">{request.toBranch.name}</span>
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <form onSubmit={sendSubmit} className="space-y-4">
            {/* Resumen de lo despachado */}
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700">Productos despachados:</p>
              {request.items.map((item) => (
                <div key={item.id} className="flex items-center gap-3 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-800">{item.product.name}</p>
                    {item.product.code && (
                      <p className="text-xs text-gray-400">Cód: {item.product.code}</p>
                    )}
                  </div>
                  <div className="text-right text-sm">
                    <p>Solicitado: <span className="font-medium">{item.quantityRequested}</span></p>
                    <p>Despachado: <span className={`font-medium ${
                      (item.quantityDispatched ?? 0) < item.quantityRequested ? 'text-orange-600' : 'text-green-600'
                    }`}>
                      {item.quantityDispatched ?? 0}
                    </span></p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-2">
              <p className="text-sm text-amber-700">
                Si todo está conforme, deje la observación vacía y presione <strong>Confirmar recepción</strong>.
                Si hay algún problema, escriba la observación y el estado cambiará a <strong>Observado</strong>.
              </p>
            </div>

            <InputCustom
              multiline
              name="observationNote"
              value={observationNote}
              label="Observación (dejar vacío si todo está bien)"
              onChange={(e) => setObservationNote(e.target.value)}
              error={false}
            />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" color="bg-gray-400" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" color="bg-green-500">
                {observationNote.trim() ? 'Marcar con Observación' : 'Confirmar Recepción'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
