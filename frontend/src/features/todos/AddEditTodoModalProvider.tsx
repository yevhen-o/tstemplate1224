import { zodResolver } from "@hookform/resolvers/zod";
import { FormProvider, useForm } from "react-hook-form";

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

  return (
    <FormProvider {...methods}>
      <AddEditTodoModal onClose={onClose} propsState={propsState} />
    </FormProvider>
  );
};
