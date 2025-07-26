import { InputCustom } from "@/components";
import type { FormUserModel } from "@/models";

interface UserFormFieldsProps {
  user: FormUserModel;
  userValid: any;
  formSubmitted: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onValueChange: (name: string, value: any) => void;
}

export const UserFormFields = ({
  user,
  userValid,
  formSubmitted,
  onInputChange,
  onValueChange,
}: UserFormFieldsProps) => {

  return (
    <>
      <InputCustom
        name="user.numberDocument"
        value={user.numberDocument}
        label="Numero de documento"
        onChange={onInputChange}
        error={!!userValid?.numberDocumentValid && formSubmitted}
        helperText={formSubmitted ? userValid?.numberDocumentValid : ''}
      />
      <InputCustom
        name="user.name"
        value={user.name}
        label="Nombre"
        onChange={onInputChange}
        error={!!userValid?.nameValid && formSubmitted}
        helperText={formSubmitted ? userValid?.nameValid : ''}
      />
      <InputCustom
        name="user.lastName"
        value={user.lastName}
        label="Apellido"
        onChange={onInputChange}
        error={!!userValid?.lastNameValid && formSubmitted}
        helperText={formSubmitted ? userValid?.lastNameValid : ''}
      />
      <InputCustom
        name="user.email"
        value={user.email}
        label="Correo electrónico"
        onChange={onInputChange}
        error={!!userValid?.emailValid && formSubmitted}
        helperText={formSubmitted ? userValid?.emailValid : ''}
      />
    </>
  );
};
