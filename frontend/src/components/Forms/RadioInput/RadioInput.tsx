import { forwardRef, HTMLProps, Ref } from "react";
import { FieldWrapper } from "../FieldWrapper/FieldWrapper";

interface RadioInputProps extends HTMLProps<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  isTouched?: boolean;
  isDirty?: boolean;
  isErrorMessageHidden?: boolean;
}

export const RadioInput = forwardRef(
  (props: RadioInputProps, ref: Ref<HTMLInputElement>) => {
    const {
      label,
      errorMessage,
      isTouched,
      isDirty,
      isErrorMessageHidden = false,
      name,
      id,
      checked,
      ...inputProps
    } = props;

    return (
      <FieldWrapper
        isThin
        isDirty={isDirty}
        isTouched={isTouched}
        errorMessage={errorMessage}
        isErrorMessageHidden={isErrorMessageHidden}
      >
        <div className="field_wrapper__input--check-box">
          <input
            id={id || name}
            {...inputProps}
            name={name}
            type="radio"
            ref={ref}
            checked={checked}
          />
          {label && <label htmlFor={id || name}>{label}</label>}
        </div>
      </FieldWrapper>
    );
  }
);
