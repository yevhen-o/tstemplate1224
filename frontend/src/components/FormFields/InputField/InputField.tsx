import {
  useState,
  forwardRef,
  PropsWithChildren,
  ForwardRefRenderFunction,
  useRef,
  ElementType,
} from "react";

import FieldLabel from "../FieldLabel/FieldLabel";

import { checkValidity, ValidationErrors } from "src/helpers/validation";
import classNames from "classnames";

type Props = {
  autoComplete?: string;
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
  placeholder?: string;
  rows?: number;
  rules?: object;
  style?: object;
  type?: string;
  values?: object;
};

const InputField: ForwardRefRenderFunction<
  HTMLInputElement | HTMLTextAreaElement,
  PropsWithChildren<Props>
> = (
  {
    autoComplete = "on",
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
    placeholder,
    rows,
    rules = {},
    style,
    type,
    values,
    ...restProps
  },
  ref
) => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const cmpRef = ref || useRef();
  const [isTouched, setIsTouched] = useState(propsIsTouched);

  const onInputChange = (
    e: React.FormEvent<HTMLInputElement> | React.FormEvent<HTMLTextAreaElement>
  ): void => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    const { value, name: field } = target;
    const { errorMessage } = checkValidity(
      value,
      rules[field as keyof typeof rules]
    );
    onChange?.(value, { formErrors: { ...formErrors, [field]: errorMessage } });
  };

  const errorMessage = formErrors[name as keyof typeof formErrors];
  const isValid = !errorMessage;

  const CMP =
    !rows || rows < 2 ? "input" : ("textarea" as unknown as ElementType);
  return (
    <div className={"col-span-full custom-input-field__wrapper"}>
      {label && (
        <FieldLabel id={id || name} isValid={isValid || !isTouched}>
          {label}
        </FieldLabel>
      )}
      <div className={"mt-2"}>
        <CMP
          ref={cmpRef}
          name={name}
          id={id || name}
          value={values && values[name as keyof typeof values]}
          disabled={disabled}
          autoComplete={autoComplete}
          rows={rows}
          className={classNames(
            "custom-input-field__field-element",
            "peer block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6",
            className,
            {
              "invalid outline-red-500": !isValid && errorMessage && isTouched,
            }
          )}
          placeholder={placeholder}
          style={style}
          type={type}
          {...restProps}
          onChange={onInputChange}
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

export default forwardRef(InputField);
