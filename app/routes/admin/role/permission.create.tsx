import { Trash2 } from 'lucide-react';
import { Button, InputCustom, SelectCustom, type ValueSelect } from '@/components';
import { TypeAction, TypeSubject, type FormPermissionModel } from '@/models';

interface Props {
  permissions: FormPermissionModel[];
  onChange: (updated: FormPermissionModel[]) => void;
  formSubmitted: boolean;
  permissionsValid?: string | null;
}

export const PermissionForm = (props: Props) => {
  const {
    permissions,
    onChange,
    formSubmitted,
    permissionsValid,
  } = props;
  const handleAdd = () => {
    const newPermission: FormPermissionModel = {
      action: null,
      subject: null,
      reason: ''
    };

    onChange([...permissions, newPermission]);
  };

  const handleRemove = (index: number) => {
    if (permissions.length == 1) return;
    const updated = permissions.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleFieldChange = (
    index: number,
    field: keyof FormPermissionModel,
    value: string
  ) => {
    const updated = [...permissions];
    updated[index] = {
      ...updated[index],
      [field]: value
    };
    onChange(updated);
  };

  const actionOptions: ValueSelect[] = Object.entries(TypeAction).map(
    ([key, value]) => ({
      id: key,
      value,
    })
  );

  const subjectOptions: ValueSelect[] = Object.entries(TypeSubject).map(
    ([key, value]) => ({
      id: key,
      value,
    })
  );

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Permisos:</h2>
        <Button
          onClick={handleAdd}
        >Agregar Permiso</Button>
      </div>
      <div className="max-h-[60vh] overflow-y-auto pr-3 space-y-2">
        {permissions.map((permission, idx) => (
          <div key={idx} className="border p-4 rounded-md relative">
            <button
              type="button"
              onClick={() => handleRemove(idx)}
              className="absolute top-2 right-2 text-error w-8 h-8 flex items-center justify-center rounded-full hover:bg-red-100 transition cursor-pointer z-10"
            >
              <Trash2 size={18} />
            </button>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <SelectCustom
                label="Acción"
                options={actionOptions}
                selected={
                  permission.action
                    ? actionOptions.find((opt) => opt.id === permission.action) ?? null
                    : null
                }
                onSelect={(value) => {
                  if (value && !Array.isArray(value)) {
                    handleFieldChange(idx, 'action', value.id as TypeAction);
                  }
                }}
                error={formSubmitted && !permission.action}
                helperText={formSubmitted && !permission.action ? 'Campo requerido' : ''}
              />
              <SelectCustom
                label="Recurso"
                options={subjectOptions}
                selected={
                  permission.subject
                    ? subjectOptions.find((opt) => opt.id === permission.subject) ?? null
                    : null
                }
                onSelect={(value) => {
                  if (value && !Array.isArray(value)) {
                    handleFieldChange(idx, 'subject', value.id as TypeSubject);
                  }
                }}
                error={formSubmitted && !permission.subject}
                helperText={formSubmitted && !permission.subject ? 'Campo requerido' : ''}
              />
            </div>
            <InputCustom
              name={`reason-${idx}`}
              label="Motivo"
              value={permission.reason}
              onChange={(e) => handleFieldChange(idx, 'reason', e.target.value)}
              error={formSubmitted && permission.reason.trim() === ''}
              helperText={formSubmitted && permission.reason.trim() === '' ? 'Campo requerido' : ''}
            />
          </div>
        ))}
      </div>
      {formSubmitted && permissionsValid && (
        <p className="text-sm text-red-600 font-medium">{permissionsValid}</p>
      )}
    </div>
  );

};
