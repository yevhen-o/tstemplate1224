import { useCallback, useEffect, useState } from "react";
import { createSelector } from "reselect";

import { useActions } from "src/hooks/useActions";
import { useTypedSelector } from "src/hooks/useTypedSelector";
import { useClientScreen } from "src/hooks/useClientScreen";
import AddTodoModal from "./AddEditTodoModal";
import Button from "src/components/Buttons";
import TodoList from "./TodoList";
import { FieldType } from "src/hooks/useForm";
import { FILTER_ALL_VALUE, withWrapperSize } from "src/hocs";

const Todos: React.FC<{ wrapperWidth: number; wrapperHeight: number }> = ({
  wrapperWidth,
  wrapperHeight,
}) => {
  const { isFetching, isFetched, hasError, todos } = useTypedSelector(
    createSelector(
      [(state) => state.todo.list, (state) => state.todo.itemsById],
      (list, itemsById) => ({
        isFetched: list.isFetched,
        isFetching: list.isFetching,
        hasError: list.hasError,
        todos: list.data.map((uid: string) => itemsById[uid]).filter(Boolean),
      })
    )
  );

  const { todoGetList } = useActions();
  const { screenWidth, screenHeight } = useClientScreen();

  useEffect(() => {
    const controller = new AbortController();
    const signal: AbortSignal = controller.signal;
    console.log("on todo get list");
    try {
      todoGetList({ signal });
    } catch (error) {
      console.log("on catch todo get list", error);
    }
    return () => {
      console.log("clear, next call");
      controller.abort();
    };
  }, [todoGetList]);

  const [showAddTodoModal, setShowAddTodoModal] = useState(false);

  const handleCloseModal = useCallback(() => {
    setShowAddTodoModal(false);
  }, [setShowAddTodoModal]);

  const initialFilterValues = {
    search: "",
    priority: FILTER_ALL_VALUE,
    isImportant: FILTER_ALL_VALUE,
    scope: FILTER_ALL_VALUE,
  };

  const filterFields: FieldType[] = [
    { fieldType: "input", name: "search", label: "Search" },
    {
      fieldType: "select",
      name: "priority",
      label: "Priority",
      options: [
        { value: FILTER_ALL_VALUE, label: "All" },
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
      ],
    },
    {
      fieldType: "select",
      name: "scope",
      label: "Scope",
      options: [
        { value: FILTER_ALL_VALUE, label: "All" },
        { value: "forWork", label: "For Work" },
        { value: "forFun", label: "For Fun" },
      ],
    },
    {
      fieldType: "select",
      name: "isImportant",
      label: "Is Important",
      options: [
        { value: FILTER_ALL_VALUE, label: "All" },
        { value: "true", label: "Important" },
        { value: "false", label: "Not important" },
      ],
    },
  ];

  return (
    <div className="px-8">
      <Button isPrimary onClick={() => setShowAddTodoModal(true)}>
        Add Todo
      </Button>

      {showAddTodoModal && <AddTodoModal onClose={handleCloseModal} />}
      {isFetching && <div>Loading...</div>}
      {hasError && <div>Something went wrong...</div>}
      {isFetched && todos && (
        <TodoList
          items={todos}
          filterFields={filterFields}
          initialValues={initialFilterValues}
        />
      )}
      {`Wrapper width: ${wrapperWidth} && wrapperHeight ${wrapperHeight}`}
      <br />
      {`Window innerWidth: ${screenWidth} && innerHeight ${screenHeight}`}
    </div>
  );
};

export default withWrapperSize(Todos);
