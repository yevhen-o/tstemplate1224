import { useState, ReactNode } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useForm,
  FieldValues,
  FormProvider,
  DefaultValues,
} from "react-hook-form";
import { FormContext } from "src/hooks/useCustomFormContext";
import { ZodSchema } from "zod";

export const ControlledForm = <T extends FieldValues>({
  onSubmit,
  schema,
  defaultValues,
  children,
  ...restProps
}: {
  children: ReactNode;
  onSubmit: (data: T) => Promise<void>;
  schema: ZodSchema<T>;
  defaultValues?: DefaultValues<T>;
}) => {
  const methods = useForm<T>({
    mode: "all",
    resolver: zodResolver(schema),
    defaultValues,
  });

  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof T, boolean>>
  >({});

  const setTouchedField = (key: keyof T) => {
    setTouchedFields({ ...touchedFields, [key]: true });
  };
  const setAllFieldsTouched = () => {
    const allFieldsTouched = Object.keys(methods.getValues()).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouchedFields(allFieldsTouched);
  };

  const extendedMethods: FormContext<T> = {
    ...methods,
    touchedFields,
    setTouchedField,
    setAllFieldsTouched,
  };

  return (
    <FormProvider {...extendedMethods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} {...restProps}>
        {children}
      </form>
    </FormProvider>
  );
};
