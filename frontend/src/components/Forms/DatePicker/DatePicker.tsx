import { forwardRef, LegacyRef } from "react";
import DatePicker, { DatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { FieldWrapper } from "../FieldWrapper/FieldWrapper";

type DatePickerFieldProps = DatePickerProps & {
  label?: string;
  errorMessage?: string;
  isTouched?: boolean;
  isDirty?: boolean;
  isErrorMessageHidden?: boolean;
};

export const DatePickerField = forwardRef(
  (props: DatePickerFieldProps, ref: LegacyRef<DatePicker>) => {
    const {
      label,
      errorMessage,
      isTouched,
      isDirty,
      isErrorMessageHidden = false,
      name,
      id,
      ...restProps
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
          <DatePicker
            autoComplete="off"
            name={name}
            ref={ref}
            id={id || name}
            {...restProps}
          />
        </div>
      </FieldWrapper>
    );
  }
);
