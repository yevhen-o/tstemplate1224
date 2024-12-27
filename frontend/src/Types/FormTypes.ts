import { ValidationErrors } from "src/helpers/validation";

type BaseFieldType = {
  name: string;
  ref?: React.Ref<any>;
  label?: string;
  helpText?: string;
  value?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  isTouched?: boolean;
  style?: object;
};

export type DefaultFormProps = {
  formErrors?: ValidationErrors;
  rules?: object;
  values?: object;
  onChange?: (arg0: string | boolean, arg1: object) => void;
  onFocus?: () => void;
};

export type InputType = BaseFieldType & {
  fieldType: "input";
  type?: string;
  autoComplete?: string;
  placeholder?: string;
  rows?: number;
};

export type SelectType = BaseFieldType & {
  fieldType: "select";
  options: { value: string; label: string }[];
};

export type CheckBoxType = BaseFieldType & {
  fieldType: "checkbox";
};

export type RadioType = BaseFieldType & {
  fieldType: "radio";
  id: string;
};

export type DatePickType = BaseFieldType & {
  fieldType: "date";
};
