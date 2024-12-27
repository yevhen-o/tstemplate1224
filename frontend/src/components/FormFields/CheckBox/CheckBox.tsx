import {
  useState,
  forwardRef,
  PropsWithChildren,
  ForwardRefRenderFunction,
  useRef,
} from "react";

import FieldLabel from "../FieldLabel/FieldLabel";

import { checkValidity } from "src/helpers/validation";
import classNames from "classnames";
import { CheckBoxType, DefaultFormProps } from "src/Types/FormTypes";

type Props = CheckBoxType & DefaultFormProps;

const CheckBox: ForwardRefRenderFunction<
  HTMLInputElement,
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
    fieldType,
    ...restProps
  },
  ref
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const cmpRef = ref || useRef(null);
  const [isTouched, setIsTouched] = useState(propsIsTouched);

  const onInputChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
    const { checked: value, name: field } = target;
    const { errorMessage } = checkValidity(
      value.toString(),
      rules[field as keyof typeof rules]
    );
    onChange?.(value, {
      formErrors: { ...formErrors, [field]: errorMessage },
    });
  };

  const errorMessage = formErrors[name as keyof typeof formErrors];
  const isValid = !errorMessage;

  return (
    <div>
      <div className="flex gap-3">
        <div className="flex h-6 shrink-0 items-center">
          <div className="group grid size-4 grid-cols-1">
            <input
              ref={cmpRef}
              name={name}
              id={id || name}
              checked={values && values[name as keyof typeof values] === true}
              disabled={disabled}
              className={classNames(
                "custom-input-field__field-element",
                "col-start-1 row-start-1 appearance-none rounded border border-gray-300 bg-white checked:border-indigo-600 checked:bg-indigo-600 indeterminate:border-indigo-600 indeterminate:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:checked:bg-gray-100 forced-colors:appearance-auto",
                className,
                {
                  "invalid outline-red-500":
                    !isValid && errorMessage && isTouched,
                }
              )}
              style={style}
              {...restProps}
              onChange={onInputChange}
              onBlur={() => setIsTouched(true)}
              onFocus={onFocus}
              type="checkbox"
            />
            <svg
              className="pointer-events-none col-start-1 row-start-1 size-3.5 self-center justify-self-center stroke-white group-has-[:disabled]:stroke-gray-950/25"
              viewBox="0 0 14 14"
              fill="none"
            >
              <path
                className="opacity-0 group-has-[:checked]:opacity-100"
                d="M3 8L6 11L11 3.5"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                className="opacity-0 group-has-[:indeterminate]:opacity-100"
                d="M3 7H11"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>
        <div className="text-sm/6">
          {label && (
            <FieldLabel id={id || name} isValid={isValid || !isTouched}>
              {label}
            </FieldLabel>
          )}
          {helpText && !(isTouched && errorMessage) && (
            <div className="text-gray-500">{helpText}</div>
          )}
        </div>
      </div>

      {!isValid && errorMessage && isTouched && (
        <div className="mt-2 text-xs text-red-500">{errorMessage}</div>
      )}
    </div>
  );
};

export default forwardRef(CheckBox);
