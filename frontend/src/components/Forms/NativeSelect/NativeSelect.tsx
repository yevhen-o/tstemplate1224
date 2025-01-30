import { forwardRef, HTMLProps, Ref } from "react";

import { FieldWrapper } from "../FieldWrapper/FieldWrapper";
import { ChevronDown } from "src/components/Icons";
import { Option } from "src/Types";

interface SelectProps extends HTMLProps<HTMLSelectElement> {
  label?: string;
  errorMessage?: string;
  isTouched?: boolean;
  isDirty?: boolean;
  isErrorMessageHidden?: boolean;
  options: Option[];
}

export const NativeSelect = forwardRef(
  (props: SelectProps, ref: Ref<HTMLSelectElement>) => {
    const {
      label,
      errorMessage,
      isTouched,
      isDirty,
      isErrorMessageHidden = false,
      name,
      id,
      options,
      ...selectProps
    } = props;

    return (
      <FieldWrapper
        isDirty={isDirty}
        isTouched={isTouched}
        errorMessage={errorMessage}
        isErrorMessageHidden={isErrorMessageHidden}
      >
        {label && <label htmlFor={id || name}>{label}</label>}
        <div className="field_wrapper__select">
          <select ref={ref} id={id || name} name={name} {...selectProps}>
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <ChevronDown size="16" />
        </div>
      </FieldWrapper>
    );
  }
);
