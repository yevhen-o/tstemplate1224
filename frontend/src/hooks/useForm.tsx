import React, { useState } from "react";
import InputField from "src/components/FormFields/InputField";
import Select from "src/components/FormFields/Select";
import CheckBox from "src/components/FormFields/CheckBox";
import RadioInput from "src/components/FormFields/RadioInput/RadioInput";

type RulesType = Record<string, any>;
type ValuesType = object;
type ErrorsType = Record<string, string | undefined | null> | undefined;

interface BaseFieldType {
  name: string;
  ref?: React.Ref<any>;
  label?: string;
  helpText?: string;
  value?: string;
}

interface InputType extends BaseFieldType {
  type: "input";
}

interface SelectType extends BaseFieldType {
  type: "select";
  options: { value: string; label: string }[];
}

interface CheckBoxType extends BaseFieldType {
  type: "checkbox";
}

interface RadioType extends BaseFieldType {
  type: "radio";
  id: string;
}

export type FieldType = InputType | SelectType | CheckBoxType | RadioType;

const useForm = (rules: RulesType, initialValues: ValuesType = {}) => {
  const [values, setValues] = useState<ValuesType>(initialValues);
  const [formErrors, setFormErrors] = useState<ErrorsType>({});

  const handleInputChange = (
    key: string,
    newValue: string | boolean | number,
    options: { formErrors?: ErrorsType } = {}
  ) => {
    const { formErrors: newFormErrors } = options;
    setValues((val) => ({ ...val, [key]: newValue }));
    if (newFormErrors) {
      setFormErrors(newFormErrors);
    }
  };

  const resetForm = () => setValues(initialValues);

  const isFormValid = () =>
    !formErrors || !Object.keys(formErrors).some((key) => !!formErrors[key]);

  const hasFormChanges = () =>
    JSON.stringify(initialValues) !== JSON.stringify(values);

  const renderFormField = (field: FieldType): JSX.Element => {
    const props = {
      name: field.name,
      ref: field.ref,
      rules,
      formErrors,
      values,
      onChange: (value: string, options: { formErrors?: ErrorsType }) =>
        handleInputChange(field.name, value, options),
    };

    switch (field.type) {
      case "radio": {
        return <RadioInput key={field.id} {...field} {...props} />;
      }
      case "checkbox": {
        return <CheckBox key={field.name} {...field} {...props} />;
      }
      case "select": {
        return <Select key={field.name} {...field} {...props} />;
      }
      default: {
        return <InputField key={field.name} {...field} {...props} />;
      }
    }
  };

  return {
    values,
    resetForm,
    formErrors,
    isFormValid,
    hasFormChanges,
    renderFormField,
    handleInputChange,
  };
};

export default useForm;
