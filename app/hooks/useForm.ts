import { useEffect, useMemo, useState } from 'react';

export const useForm = (initialForm: any = {}, formValidations: any = {}) => {

  const [formState, setFormState] = useState({ ...initialForm });
  const [formValidation, setFormValidation] = useState<any>({});

  useEffect(() => {
    createValidators();
  }, [formState]);

  useEffect(() => {
    setFormState({ ...initialForm });
  }, [initialForm]);

  const isFormValid = useMemo(() => {
    const checkValidity = (obj: any) => {
      for (const key in obj) {
        if (typeof obj[key] === 'object' && obj[key] !== null) {
          if (!checkValidity(obj[key])) return false;
        } else {
          if (obj[key] !== null) return false;
        }
      }
      return true;
    };

    return checkValidity(formValidation);
  }, [formValidation]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState((prevState: any) => setNestedValue(prevState, name, value));
  };

  const isSelectChange = (name: string, text: string) => {
    setFormState({
      ...formState,
      [name]: text
    })
  }
  const onFileChange = (name: string, file: File) => {
    setFormState({
      ...formState,
      [name]: file
    })
  }

  const onSwitchChange = (name: string, state: boolean) => {
    setFormState({
      ...formState,
      [name]: state
    })
  }

  const onArrayChange = (name: string, state: Array<any>) => {
    setFormState({
      ...formState,
      [name]: state
    })
  }

  const onValueChange = (name: string, value: any) => {
    setFormState((prevState: any) => setNestedValue(prevState, name, value));
  };

  const onResetForm = () => {
    setFormState(initialForm);
  };

  const setNestedValue = (obj: any, path: string, value: any) => {
    const keys = path.split('.');
    const updated = { ...obj };
    let current = updated;
    for (let i = 0; i < keys.length - 1; i++) {
      current[keys[i]] = { ...current[keys[i]] };
      current = current[keys[i]];
    }
    current[keys[keys.length - 1]] = value;
    return updated;
  };

  const createValidators = () => {
    const buildValidation = (state: any, validations: any) => {
      const result: any = {};
      for (const key in validations) {
        if (typeof validations[key] === 'object' && !Array.isArray(validations[key])) {
          result[`${key}Valid`] = buildValidation(state[key] ?? {}, validations[key]);
        } else {
          const [fn, message] = validations[key];
          result[`${key}Valid`] = fn(state[key], state) ? null : message;
        }
      }
      return result;
    };

    setFormValidation(buildValidation(formState, formValidations));
  };

  return {
    ...formState,
    formState,
    ...formValidation,
    onInputChange,
    isSelectChange,
    onFileChange,
    onSwitchChange,
    onArrayChange,
    onValueChange,
    onResetForm,
    isFormValid,
  };
};
