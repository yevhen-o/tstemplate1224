import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";
import { FormContext } from "src/hooks/useCustomFormContext";

import { TodoSchemaType, todoSchema, defaultValues } from "./types/todoSchema";
import AddEditTodoModal from "./AddEditTodoModal";
import { TodoInterface } from "src/Types";

export const AddEditTodoModalProvider = ({
  onClose,
  propsState,
}: {
  onClose: () => void;
  propsState?: TodoInterface;
}) => {
  const methods = useForm<TodoSchemaType>({
    mode: "all",
    resolver: zodResolver(todoSchema),
    defaultValues,
  });

  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof TodoSchemaType, boolean>>
  >({});

  const setTouchedField = (key: keyof TodoSchemaType) => {
    setTouchedFields({ ...touchedFields, [key]: true });
  };
  const setAllFieldsTouched = () => {
    const allFieldsTouched = Object.keys(methods.getValues()).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouchedFields(allFieldsTouched);
  };

  const extendedMethods: FormContext<TodoSchemaType> = {
    ...methods,
    touchedFields,
    setTouchedField,
    setAllFieldsTouched,
  };

  return (
    <FormProvider {...extendedMethods}>
      <AddEditTodoModal onClose={onClose} propsState={propsState} />
    </FormProvider>
  );
};
