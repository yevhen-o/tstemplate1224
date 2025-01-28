import { forwardRef, HTMLProps, Ref } from "react";
import { FieldWrapper } from "../FieldWrapper/FieldWrapper";

interface CheckBoxProps extends HTMLProps<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  isTouched?: boolean;
  isDirty?: boolean;
  isErrorMessageHidden?: boolean;
}

export const CheckBox = forwardRef(
  (props: CheckBoxProps, ref: Ref<HTMLInputElement>) => {
    const {
      label,
      errorMessage,
      isTouched,
      isDirty,
      isErrorMessageHidden = false,
      name,
      id,
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
          <input id={id || name} {...inputProps} type="checkbox" ref={ref} />
          {label && <label htmlFor={id || name}>{label}</label>}
        </div>
      </FieldWrapper>
    );
  }
);
