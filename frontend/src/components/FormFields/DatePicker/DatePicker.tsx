import { useState } from "react";
import classNames from "classnames";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./DatePicker.scss";

import FieldLabel from "../FieldLabel/FieldLabel";
import { checkValidity } from "src/helpers/validation";
import { DatePickType, DefaultFormProps } from "src/Types/FormTypes";

type Props = DatePickType & DefaultFormProps;

const DatePickerImpl: React.FC<Props> = ({
  className,
  disabled,
  formErrors = {},
  helpText,
  id,
  isTouched: propsIsTouched = false,
  label,
  name,
  onChange,
  onFocus,
  rules = {},
  style,
  values,
  fieldType,
  ...restProps
}) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const [isTouched, setIsTouched] = useState(propsIsTouched);

  const onInputChange = (value: Date): void => {
    const { errorMessage } = checkValidity(
      value.toString(),
      rules[name as keyof typeof rules]
    );
    onChange?.(value.toString(), {
      formErrors: { ...formErrors, [name]: errorMessage },
    });
  };

  const errorMessage = formErrors[name as keyof typeof formErrors];
  const isValid = !errorMessage;

  return (
    <div className={"col-span-full custom-input-field__wrapper"}>
      {label && (
        <FieldLabel id={id || name} isValid={isValid || !isTouched}>
          {label}
        </FieldLabel>
      )}
      <div className={"mt-2"}>
        <DatePicker
          autoComplete="off"
          selected={values && values[name as keyof typeof values]}
          onChange={(date) => date && onInputChange(date)}
          name={name}
          id={id || name}
          disabled={disabled}
          className={classNames(
            "custom-input-field__field-element",
            "peer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6",
            className,
            {
              "invalid outline-red-500": !isValid && errorMessage && isTouched,
            }
          )}
          {...restProps}
          onBlur={() => setIsTouched(true)}
          onFocus={onFocus}
        />
      </div>

      {!isValid && errorMessage && isTouched && (
        <div className="mt-2 text-xs text-red-500">{errorMessage}</div>
      )}
      {helpText && !(isTouched && errorMessage) && (
        <div className="text-gray-500">{helpText}</div>
      )}
    </div>
  );
};

export default DatePickerImpl;
