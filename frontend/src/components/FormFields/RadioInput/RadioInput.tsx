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
  id: string;
  isTouched?: boolean;
  label?: string;
  name: string;
  onChange?: (arg0: string, arg1: object) => void;
  onFocus?: () => void;
  rules?: object;
  style?: object;
  values?: object;
};

const RadioInput: ForwardRefRenderFunction<
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
    ...restProps
  },
  ref
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const cmpRef = ref || useRef(null);
  const [isTouched, setIsTouched] = useState(propsIsTouched);

  const onInputChange = (e: React.FormEvent<HTMLInputElement>): void => {
    const target = e.target as HTMLInputElement;
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
      <div className="flex items-top gap-x-3">
        <div className="flex h-6 shrink-0 items-center">
          <input
            ref={cmpRef}
            name={name}
            id={id || name}
            value={values && values[name as keyof typeof values]}
            disabled={disabled}
            className={classNames(
              "custom-input-field__field-element",
              "relative size-4 appearance-none rounded-full border border-gray-300 bg-white before:absolute before:inset-1 before:rounded-full before:bg-white checked:border-indigo-600 checked:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:border-gray-300 disabled:bg-gray-100 disabled:before:bg-gray-400 forced-colors:appearance-auto forced-colors:before:hidden [&:not(:checked)]:before:hidden",
              className,
              {
                "invalid outline-red-500":
                  !isValid && errorMessage && isTouched,
              }
            )}
            style={style}
            type="radio"
            {...restProps}
            onChange={onInputChange}
            onBlur={() => setIsTouched(true)}
            onFocus={onFocus}
          />
        </div>
        <div className="text-sm/6">
          {label && (
            <FieldLabel id={id || name} isValid={isValid || !isTouched}>
              {label}
            </FieldLabel>
          )}
          {helpText && !(isTouched && errorMessage) && (
            <div className="text-gray-500 size=12">{helpText}</div>
          )}
        </div>
      </div>

      {!isValid && errorMessage && isTouched && (
        <div className="mt-2 text-xs text-red-500">{errorMessage}</div>
      )}
    </div>
  );
};

export default forwardRef(RadioInput);
