import {
  useRef,
  useState,
  forwardRef,
  PropsWithChildren,
  ForwardRefRenderFunction,
} from "react";
import classNames from "classnames";

import FieldLabel from "../FieldLabel/FieldLabel";
import { ChevronDown } from "src/components/Icons";
import { checkValidity } from "src/helpers/validation";
import { DefaultFormProps, SelectType } from "src/Types/FormTypes";

type Props = SelectType & DefaultFormProps;

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
    fieldType,
    ...restProps
  },
  ref
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const cmpRef = ref || useRef(null);
  const [internalIsTouched, setInternalIsTouched] = useState(false);
  const isTouched = propsIsTouched || internalIsTouched;

  const onInputChange = (e: React.FormEvent<HTMLSelectElement>): void => {
    const target = e.target as HTMLSelectElement;
    const { value, name: field } = target;
    const { errorMessage } = checkValidity(
      value,
      rules[field as keyof typeof rules],
      values
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
      <div className={classNames("grid grid-cols-1", { "mt-2": !!label })}>
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
            fieldType,
            {
              "invalid outline-red-500": !isValid && errorMessage && isTouched,
            }
          )}
          style={style}
          {...restProps}
          onChange={onInputChange}
          onBlur={() => setInternalIsTouched(true)}
          onFocus={onFocus}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <ChevronDown
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-gray-500 sm:size-4"
          size={16}
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

export default forwardRef(Select);
