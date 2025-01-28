import { HTMLProps } from "react";
import { Controller, FieldValues, useFormContext, Path } from "react-hook-form";
import { InputField } from "./InputField";

type InputProps<T extends FieldValues> = {
  name: Path<T>;
  isTouched?: boolean;
  handleBlur?: () => void;
  isErrorMessageHidden?: boolean;
} & HTMLProps<HTMLInputElement>;

export const ControlledInputField = <T extends FieldValues>({
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
          <InputField
            {...rest}
            {...restFieldsProps}
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
