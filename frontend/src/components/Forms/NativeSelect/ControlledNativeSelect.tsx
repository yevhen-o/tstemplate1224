import { HTMLProps } from "react";
import { Controller, FieldValues, Path } from "react-hook-form";
import { useCustomFormContext } from "src/hooks/useCustomFormContext";
import { NativeSelect } from "./NativeSelect";
import { Option } from "src/Types";

type SelectProps<T extends FieldValues> = {
  name: Path<T>;
  isErrorMessageHidden?: boolean;
  options: Option[];
} & HTMLProps<HTMLSelectElement>;

export const ControlledNativeSelect = <T extends FieldValues>({
  name,
  options,
  ...rest
}: SelectProps<T>) => {
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
          <NativeSelect
            {...rest}
            {...restFieldsProps}
            onBlur={() => {
              onBlur();
              setTouchedField(name);
            }}
            errorMessage={error?.message}
            isTouched={touchedFields[name]}
            isDirty={isDirty}
            options={options}
          />
        </>
      )}
    />
  );
};
