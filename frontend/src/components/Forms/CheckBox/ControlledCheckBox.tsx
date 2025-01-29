import { HTMLProps } from "react";
import { Controller, FieldValues, Path } from "react-hook-form";
import { CheckBox } from "./CheckBox";

import { useCustomFormContext } from "src/hooks/useCustomFormContext";

type CheckBoxProps<T extends FieldValues> = {
  name: Path<T>;
  isErrorMessageHidden?: boolean;
} & HTMLProps<HTMLInputElement>;

export const ControlledCheckBox = <T extends FieldValues>({
  name,
  ...rest
}: CheckBoxProps<T>) => {
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
          <CheckBox
            {...rest}
            {...restFieldsProps}
            onBlur={() => {
              onBlur();
              setTouchedField(name);
            }}
            checked={restFieldsProps.value}
            errorMessage={error?.message}
            isTouched={touchedFields[name]}
            isDirty={isDirty}
          />
        </>
      )}
    />
  );
};
