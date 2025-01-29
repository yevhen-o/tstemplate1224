import { HTMLProps } from "react";
import { Controller, FieldValues, Path } from "react-hook-form";
import { RadioInput } from "./RadioInput";

import { useCustomFormContext } from "src/hooks/useCustomFormContext";

type RadioInputProps<T extends FieldValues> = {
  name: Path<T>;
  value: string;
  isErrorMessageHidden?: boolean;
} & HTMLProps<HTMLInputElement>;

export const ControlledRadioInput = <T extends FieldValues>({
  name,
  value,
  ...rest
}: RadioInputProps<T>) => {
  const { control, touchedFields, setTouchedField } = useCustomFormContext<T>();

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
              setTouchedField(name);
            }}
            value={value}
            checked={formValue === value}
            errorMessage={error?.message}
            isTouched={touchedFields[name]}
            isDirty={isDirty}
          />
        </>
      )}
    />
  );
};
