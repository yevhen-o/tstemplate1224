import { Controller, FieldValues, useFormContext, Path } from "react-hook-form";
import { DatePickerField } from "./DatePicker";
import { DatePickerProps } from "react-datepicker";

type InputProps<T extends FieldValues> = {
  name: Path<T>;
  label?: string;
  isTouched?: boolean;
  handleBlur?: () => void;
  isErrorMessageHidden?: boolean;
} & DatePickerProps;

export const ControlledDatePicker = <T extends FieldValues>({
  name,
  handleBlur,
  isTouched,
  ...rest
}: InputProps<T>) => {
  const { control } = useFormContext();

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
            // onChange={(date: null | Date | Array<Date | null>) => {
            //   if (date === null) {
            //     onChange(null);
            //   } else if (Array.isArray(date)) {
            //     onChange(date?.[0]?.toDateString());
            //   } else {
            //     onChange(date?.toDateString());
            //   }
            // }}
            selected={restFieldsProps.value}
            onBlur={() => {
              onBlur();
              handleBlur?.();
            }}
            errorMessage={error?.message}
            isTouched={isTouched}
            isDirty={isDirty}
          />
        </>
      )}
    />
  );
};
