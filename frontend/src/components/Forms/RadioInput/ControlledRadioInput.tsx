import { HTMLProps } from "react";
import { Controller, FieldValues, useFormContext, Path } from "react-hook-form";
import { RadioInput } from "./RadioInput";

type RadioInputProps<T extends FieldValues> = {
  name: Path<T>;
  value: string;
  isTouched?: boolean;
  handleBlur?: () => void;
  isErrorMessageHidden?: boolean;
} & HTMLProps<HTMLInputElement>;

export const ControlledRadioInput = <T extends FieldValues>({
  name,
  handleBlur,
  isTouched,
  value,
  ...rest
}: RadioInputProps<T>) => {
  const { control } = useFormContext();

  return (
    <Controller
      name={name}
      control={control}
      render={({
        field: { value: formValue, onBlur, ...restFieldsProps },
        fieldState: { error, isDirty },
      }) => (
        <>
          <RadioInput
            {...rest}
            {...restFieldsProps}
            onBlur={() => {
              onBlur();
              handleBlur?.();
            }}
            value={value}
            checked={formValue === value}
            errorMessage={error?.message}
            isTouched={isTouched}
            isDirty={isDirty}
          />
        </>
      )}
    />
  );
};
