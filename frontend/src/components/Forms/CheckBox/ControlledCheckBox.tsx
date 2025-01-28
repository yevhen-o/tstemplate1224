import { HTMLProps } from "react";
import { Controller, FieldValues, useFormContext, Path } from "react-hook-form";
import { CheckBox } from "./CheckBox";

type CheckBoxProps<T extends FieldValues> = {
  name: Path<T>;
  isTouched?: boolean;
  handleBlur?: () => void;
  isErrorMessageHidden?: boolean;
} & HTMLProps<HTMLInputElement>;

export const ControlledCheckBox = <T extends FieldValues>({
  name,
  handleBlur,
  isTouched,
  ...rest
}: CheckBoxProps<T>) => {
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
          <CheckBox
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
