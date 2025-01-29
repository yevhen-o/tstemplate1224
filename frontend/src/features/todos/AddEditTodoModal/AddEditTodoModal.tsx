import { useActions } from "src/hooks";
import Modal from "src/components/Modal";
import { ResponseThunkAction, TodoInterface } from "src/Types";
import { ControlledForm } from "src/components/Forms/ControlledForm";
import { TodoSchemaType, todoSchema, defaultValues } from "./types/todoSchema";
import { AddEditTodoForm } from "./AddEditTodoForm";

export const AddEditTodoModal = ({
  onClose,
  propsState,
}: {
  onClose: () => void;
  propsState?: TodoInterface;
}) => {
  const { todoPostItem, todoPatchItem } = useActions();

  const submitFunction = async (data: TodoSchemaType) => {
    let result: ResponseThunkAction;
    if (propsState) {
      result = (await todoPatchItem({
        uid: propsState.uid,
        item: { ...data, deadline: data.deadline.toDateString() },
      })) as unknown as ResponseThunkAction;
    } else {
      result = (await todoPostItem({
        item: {
          uid: Math.random().toString(36).slice(2, 16),
          ...data,
          deadline: data.deadline.toDateString(),
        },
      })) as unknown as ResponseThunkAction;
    }
    if (!result.error) {
      onClose();
    }
  };
  return (
    <Modal title="Add new todo" onClose={onClose}>
      <ControlledForm<TodoSchemaType>
        schema={todoSchema}
        onSubmit={submitFunction}
        defaultValues={
          propsState
            ? {
                ...propsState,
                deadline: new Date(propsState.deadline),
              }
            : defaultValues
        }
      >
        <AddEditTodoForm propsState={propsState} />
      </ControlledForm>
    </Modal>
  );
};
