import { useState, type FormEvent } from 'react';
import { Button, InputCustom } from '@/components';
import type { TransferRequestModel, RejectTransferRequestBody } from '@/models';

interface Props {
  request: TransferRequestModel;
  handleClose: () => void;
  onReject: (id: string, body: RejectTransferRequestBody) => Promise<void>;
}

export const TransferRequestReject = ({ request, handleClose, onReject }: Props) => {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!rejectionNote.trim()) return;

    await onReject(request.id, { rejectionNote: rejectionNote.trim() });
    handleClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-4 sm:px-6 py-4 z-10">
          <h2 className="text-lg font-bold text-red-600">Rechazar Solicitud</h2>
          <p className="text-sm text-gray-500">
            De <span className="font-medium">{request.fromBranch.name}</span> hacia <span className="font-medium">{request.toBranch.name}</span>
          </p>
        </div>

        <div className="p-4 sm:p-6">
          <form onSubmit={sendSubmit} className="space-y-4">
            <InputCustom
              multiline
              name="rejectionNote"
              value={rejectionNote}
              label="Motivo de rechazo"
              onChange={(e) => setRejectionNote(e.target.value)}
              error={!!formSubmitted && !rejectionNote.trim()}
              helperText={formSubmitted && !rejectionNote.trim() ? 'Debe indicar un motivo' : ''}
            />

            <div className="flex justify-end gap-2 pt-4 border-t">
              <Button type="button" color="bg-gray-400" onClick={handleClose}>
                Cancelar
              </Button>
              <Button type="submit" color="bg-red-500">
                Rechazar
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
