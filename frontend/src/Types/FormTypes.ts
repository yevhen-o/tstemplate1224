import { ValidationErrors } from "src/helpers/validation";
import { Rule } from "src/helpers/validation/constants";

export type Value =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | object;

export type ErrorMessage = string | null;

export type Values = Record<string, Value>;
export type Rules<V extends Values = Values> = Partial<Record<keyof V, Rule>>;
export type ValidationErrors<V extends Values = Values> = Partial<
  Record<keyof V, ErrorMessage>
>;

type BaseFieldType = {
  name: string;
  ref?: React.Ref<any>; // eslint-disable-line @typescript-eslint/no-explicit-any
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
  values?: Values;
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
