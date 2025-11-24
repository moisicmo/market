import { useState, type FormEvent } from 'react';
import { useForm } from '@/hooks';
import { Button, DateTimePickerCustom, InputCustom, SelectCustom, ValueSelect } from '@/components';
import {
  formInputFields,
  formInputValidations,
  type KardexModel,
  type InputRequest,
} from '@/models';
import { Trash2 } from 'lucide-react';

interface Props {
  branchId: string;
  dataKardex: KardexModel[];
  handleClose: () => void;
  onCreate: (body: InputRequest) => void;
}

type PresentationErrors = {
  quantity?: string;
  price?: string;
  dueDate?: string;
};

export const InputCreate = ({
  branchId,
  dataKardex,
  handleClose,
  onCreate,
}: Props) => {
  const {
    detail,
    onInputChange,
    onResetForm,
    isFormValid,
    detailValid,
  } = useForm(formInputFields, formInputValidations);

  const [formSubmitted, setFormSubmitted] = useState(false);
  // const [presentations, setPresentations] = useState<PresentationModel[]>([]);
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);

  // const validatePresentations = (presentations: PresentationModel[]): PresentationErrors[] => {
  //   return presentations.map((p) => {
  //     const errors: PresentationErrors = {};
  //     const [validQty, msgQty] = presentationValidations.quantity;
  //     const [validPrice, msgPrice] = presentationValidations.price;
  //     const [validDue, msgDue] = presentationValidations.dueDate;

  //     if (!validQty(p.quantity)) errors.quantity = msgQty;
  //     if (!validPrice(p.price)) errors.price = msgPrice;
  //     if (!validDue(p.dueDate)) errors.dueDate = msgDue;

  //     return errors;
  //   });
  // };

  // const presentationErrors = validatePresentations(presentations);
  // const hasPresentationErrors = presentationErrors.some((err) =>
  //   Object.values(err).some(Boolean)
  // );

  const sendSubmit = async (e: FormEvent<HTMLFormElement>) => {
    // e.preventDefault();
    // setFormSubmitted(true);

    // console.log('isFormValid:', isFormValid);
    // console.log('presentations:', presentations);
    // console.log('presentationErrors:', presentationErrors);
    // console.log('hasPresentationErrors:', hasPresentationErrors);

    // if (!isFormValid || presentations.length === 0 || hasPresentationErrors) return;

    // console.log('evaluando');


    // const formattedPresentations = presentations.map((p) => ({
    //   productPresentationId: p.productPresentation.id,
    //   quantity: p.quantity,
    //   price: p.price,
    //   dueDate: p.dueDate,
    // }));
    // console.log('creando')
    // await onCreate({
    //   branchId,
    //   detail: detail.trim(),
    //   presentations: formattedPresentations,
    // });

    // handleClose();
    // onResetForm();
    // setPresentations([]);
    // setFormSubmitted(false);
  };

  const handleAddPresentation = () => {
    // if (selectedIdx === null) return;
    // const selected = dataKardex[selectedIdx].presentation;

    // // Evitar duplicados
    // if (presentations.find((p) => p.productPresentation.id === selected.id)) return;

    // setPresentations((prev) => [
    //   ...prev,
    //   {
    //     productPresentation: selected,
    //     quantity: 1,
    //     price: 0,
    //     dueDate: new Date(),
    //   },
    // ]);
  };


  const handleRemove = (index: number) => {
    // setPresentations((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">Nueva Entrada</h2>

        
      </div>
    </div>
  );
};
