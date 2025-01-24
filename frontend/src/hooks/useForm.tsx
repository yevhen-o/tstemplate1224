import { useState, useCallback } from "react";
import InputField from "src/components/FormFields/InputField";
import Select from "src/components/FormFields/Select";
import CheckBox from "src/components/FormFields/CheckBox";
import RadioInput from "src/components/FormFields/RadioInput";
import DatePicker from "src/components/FormFields/DatePicker";
import { getValidationErrors } from "src/helpers/validation";
import {
  InputType,
  SelectType,
  CheckBoxType,
  RadioType,
  DatePickType,
} from "src/Types/FormTypes";
import { deepEqual } from "src/helpers/utils";
import { Rule } from "src/helpers/validation/constants";

export type Value = string | number | boolean | null | undefined;
type ErrorsType = Record<string, string | undefined | null> | undefined;

export type FormValueType = Record<string, Value>;

export type FieldType =
  | InputType
  | SelectType
  | CheckBoxType
  | RadioType
  | DatePickType;

export const useForm = <T extends FormValueType>(
  rules: Partial<Record<keyof T, Rule>>,
  initialValues: T = {} as T,
  formFields: FieldType[] = []
) => {
  const [fields, setFields] = useState<FieldType[]>(formFields);
  const [values, setValues] = useState<T>(initialValues);
  const [formErrors, setFormErrors] = useState<ErrorsType>(
    getValidationErrors(initialValues, rules)
  );

  const setFieldsTouched = useCallback(
    () =>
      setFields((fields) => [
        ...fields.map((field) => ({ ...field, isTouched: true })),
      ]),
    []
  );

  const updateValues = useCallback(
    (newValues: T) => {
      if (!deepEqual(initialValues, newValues)) {
        setValues(newValues);
      }
    },
    [initialValues]
  );

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

  const resetForm = () => {
    setValues(initialValues);
    setFormErrors(getValidationErrors(initialValues, rules));
  };

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
      onChange: (
        value: string | boolean,
        options: { formErrors?: ErrorsType }
      ) => handleInputChange(field.name, value, options),
    };

    switch (field.fieldType) {
      case "date": {
        return <DatePicker key={field.name} {...field} {...props} />;
      }
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
    fields,
    values,
    resetForm,
    formErrors,
    isFormValid,
    updateValues,
    setFormErrors,
    hasFormChanges,
    renderFormField,
    setFieldsTouched,
    handleInputChange,
  };
};
