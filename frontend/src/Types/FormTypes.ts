import { ValidationErrors } from "src/helpers/validation";

type BaseFieldType = {
  name: string;
  ref?: React.Ref<any>;
  label?: string;
  helpText?: string;
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
  value?: string;
  autoComplete?: string;
  placeholder?: string;
  rows?: number;
};

export type OptionType = {
  value: string | number;
  label: string;
  [key: string | number | symbol]: unknown;
};

export type SelectType = BaseFieldType & {
  fieldType: "select";
  options: OptionType[];
  value?: string;
};

export type MultiSelectType = BaseFieldType & {
  fieldType: "multiSelect";
  isBordered?: boolean;
  isMultiple?: boolean;
  isSearchable?: boolean;
  isCloseOnSelect?: boolean;
  tabIndex?: number;
  placeholder?: string;
  value: Array<string | number> | undefined;
  onChange?: (arg0: Array<string | number>, arg1: object) => void;
  options: OptionType[];
};

export type CheckBoxType = BaseFieldType & {
  value?: string;
  fieldType: "checkbox";
};

export type RadioType = BaseFieldType & {
  value?: string;
  fieldType: "radio";
  id: string;
};

export type DatePickType = BaseFieldType & {
  value?: string;
  fieldType: "date";
};
