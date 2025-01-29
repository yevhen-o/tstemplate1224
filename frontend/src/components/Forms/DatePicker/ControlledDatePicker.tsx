import { Controller, FieldValues, Path } from "react-hook-form";
import { DatePickerField } from "./DatePicker";
import { DatePickerProps } from "react-datepicker";

import { useCustomFormContext } from "src/hooks/useCustomFormContext";

type InputProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  isErrorMessageHidden?: boolean;
} & DatePickerProps;

export const ControlledDatePicker = <T extends FieldValues>({
  name,
  ...rest
}: InputProps<T>) => {
  const { control, touchedFields, setTouchedField } = useCustomFormContext<T>();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { onBlur, ...restFieldsProps },
        fieldState: { error, isDirty },
      }) => (
        <>
          <DatePickerField
            {...rest}
            {...restFieldsProps}
            selected={restFieldsProps.value}
            onBlur={() => {
              onBlur();
              setTouchedField(name);
            }}
            errorMessage={error?.message}
            isTouched={touchedFields[name]}
            isDirty={isDirty}
          />
        </>
      )}
    />
  );
};
