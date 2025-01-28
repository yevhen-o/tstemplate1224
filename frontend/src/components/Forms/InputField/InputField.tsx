import { forwardRef, HTMLProps, Ref, useState } from "react";
import { View, ViewOff } from "src/components/Icons";
import classNames from "classnames";
import "./InputField.scss";

interface InputProps extends HTMLProps<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  isTouched?: boolean;
  isDirty?: boolean;
  isErrorMessageHidden?: boolean;
}

const InputField = forwardRef(
  (props: InputProps, ref: Ref<HTMLInputElement>) => {
    const {
      label,
      errorMessage,
      isTouched,
      isDirty,
      isErrorMessageHidden = false,
      type,
      ...inputProps
    } = props;

    const [fieldType, setFieldType] = useState<string | undefined>(type);

    return (
      <div
        className={classNames("field_wrapper", {
          "field_wrapper--error": errorMessage && isTouched,
          "field_wrapper--success": !errorMessage && isDirty,
        })}
      >
        {label && <label htmlFor={inputProps.name}>{label}</label>}
        <div className="field_wrapper__input">
          <input
            id={inputProps.name}
            {...inputProps}
            ref={ref}
            type={fieldType}
          />
          {type === "password" && (
            <span
              className="field_wrapper__toggle"
              role="button"
              onClick={() =>
                setFieldType((prev) =>
                  prev === "password" ? "text" : "password"
                )
              }
            >
              {fieldType === "password" ? <ViewOff /> : <View />}
            </span>
          )}
        </div>
        {!isErrorMessageHidden && errorMessage && isTouched && (
          <small>{errorMessage}</small>
        )}
      </div>
    );
  }
);

export default InputField;
