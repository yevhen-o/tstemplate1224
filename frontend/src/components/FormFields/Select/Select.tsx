import {
  useState,
  forwardRef,
  PropsWithChildren,
  ForwardRefRenderFunction,
  useRef,
} from "react";

import FieldLabel from "../FieldLabel/FieldLabel";

import { checkValidity, ValidationErrors } from "src/helpers/validation";
import classNames from "classnames";

type Props = {
  className?: string;
  disabled?: boolean;
  formErrors?: ValidationErrors;
  helpText?: string;
  id?: string;
  isTouched?: boolean;
  label?: string;
  name: string;
  onChange?: (arg0: string, arg1: object) => void;
  onFocus?: () => void;
  rules?: object;
  style?: object;
  values?: object;
  options: { value: string; label: string }[];
};

const Select: ForwardRefRenderFunction<
  HTMLSelectElement,
  PropsWithChildren<Props>
> = (
  {
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
    options,
    ...restProps
  },
  ref
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const cmpRef = ref || useRef(null);
  const [isTouched, setIsTouched] = useState(propsIsTouched);

  const onInputChange = (e: React.FormEvent<HTMLSelectElement>): void => {
    const target = e.target as HTMLSelectElement;
    const { value, name: field } = target;
    const { errorMessage } = checkValidity(
      value,
      rules[field as keyof typeof rules]
    );
    onChange?.(value, { formErrors: { ...formErrors, [field]: errorMessage } });
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
      <div className="mt-2 grid grid-cols-1">
        <select
          ref={cmpRef}
          name={name}
          id={id || name}
          value={values && values[name as keyof typeof values]}
          disabled={disabled}
          className={classNames(
            "custom-input-field__field-element",
            "col-start-1 row-start-1 w-full appearance-none rounded-md bg-white py-1.5 pl-3 pr-8 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6",
            className,
            {
              "invalid outline-red-500": !isValid && errorMessage && isTouched,
            }
          )}
          style={style}
          {...restProps}
          onChange={onInputChange}
          onBlur={() => setIsTouched(true)}
          onFocus={onFocus}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <svg
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          viewBox="0 0 16 16"
          fill="currentColor"
          aria-hidden="true"
          data-slot="icon"
        >
          <path
            fillRule="evenodd"
            d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z"
            clipRule="evenodd"
          />
        </svg>
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

export default forwardRef(Select);
