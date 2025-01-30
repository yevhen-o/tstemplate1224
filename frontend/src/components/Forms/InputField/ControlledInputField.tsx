import { HTMLProps } from "react";
import { Controller, FieldValues, Path } from "react-hook-form";
import { useCustomFormContext } from "src/hooks/useCustomFormContext";

import { InputField } from "./InputField";

type InputProps<T extends FieldValues> = {
  name: Path<T>;
  isErrorMessageHidden?: boolean;
} & HTMLProps<HTMLInputElement>;

export const ControlledInputField = <T extends FieldValues>({
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
          <InputField
            {...rest}
            {...restFieldsProps}
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
