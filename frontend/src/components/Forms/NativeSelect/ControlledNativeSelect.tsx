import { HTMLProps } from "react";
import { Controller, FieldValues, useFormContext, Path } from "react-hook-form";
import { NativeSelect } from "./NativeSelect";
import { Option } from "src/Types";

type SelectProps<T extends FieldValues> = {
  name: Path<T>;
  isTouched?: boolean;
  handleBlur?: () => void;
  isErrorMessageHidden?: boolean;
  options: Option[];
} & HTMLProps<HTMLSelectElement>;

export const ControlledNativeSelect = <T extends FieldValues>({
  name,
  handleBlur,
  isTouched,
  options,
  ...rest
}: SelectProps<T>) => {
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
          <NativeSelect
            {...rest}
            {...restFieldsProps}
            onBlur={() => {
              onBlur();
              handleBlur?.();
            }}
            errorMessage={error?.message}
            isTouched={isTouched}
            isDirty={isDirty}
            options={options}
          />
        </>
      )}
    />
  );
};
