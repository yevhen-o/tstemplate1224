import { forwardRef, HTMLProps, Ref } from "react";
import classNames from "classnames";

interface InputProps extends HTMLProps<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  isTouched?: boolean;
  isDirty?: boolean;
}

const InputField = forwardRef(
  (props: InputProps, ref: Ref<HTMLInputElement>) => {
    const { label, errorMessage, isTouched, isDirty, ...inputProps } = props;

    return (
      <div
        className={classNames("field_wrapper", {
          "field_wrapper--error": errorMessage && isTouched,
          "field_wrapper--success": !errorMessage && isDirty,
        })}
      >
        {label && <label htmlFor={inputProps.name}>{label}</label>}
        <input {...inputProps} ref={ref} />
        {errorMessage && isTouched && <>{errorMessage}</>}
      </div>
    );
  }
);

export default InputField;
