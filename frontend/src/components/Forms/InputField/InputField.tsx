import { forwardRef, HTMLProps, Ref, useState } from "react";
import { View, ViewOff } from "src/components/Icons";
import { FieldWrapper } from "../FieldWrapper/FieldWrapper";

interface InputProps extends HTMLProps<HTMLInputElement> {
  label?: string;
  errorMessage?: string;
  isTouched?: boolean;
  isDirty?: boolean;
  isErrorMessageHidden?: boolean;
}

export const InputField = forwardRef(
  (props: InputProps, ref: Ref<HTMLInputElement>) => {
    const {
      label,
      errorMessage,
      isTouched,
      isDirty,
      isErrorMessageHidden = false,
      type,
      name,
      id,
      ...inputProps
    } = props;

    const [fieldType, setFieldType] = useState<string | undefined>(type);

    return (
      <FieldWrapper
        isDirty={isDirty}
        isTouched={isTouched}
        errorMessage={errorMessage}
        isErrorMessageHidden={isErrorMessageHidden}
      >
        {label && <label htmlFor={id || name}>{label}</label>}
        <div className="field_wrapper__input">
          <input
            id={id || name}
            {...inputProps}
            name={name}
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
      </FieldWrapper>
    );
  }
);
