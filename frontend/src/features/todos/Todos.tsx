import { useEffect, useState } from "react";
import { createSelector } from "reselect";

import { useActions } from "src/hooks/useActions";
import { useTypedSelector } from "src/hooks/useTypedSelector";
import { AddEditTodoModalProvider } from "./AddEditTodoModalProvider";
import Button from "src/components/Buttons";
import TodoList from "./TodoListWithHOC";
import { FieldType } from "src/hooks/useForm";
import { FILTER_ALL_VALUE } from "src/constants";

const Todos: React.FC = () => {
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

  useEffect(() => {
    const controller = new AbortController();
    const signal: AbortSignal = controller.signal;
    todoGetList({ signal });
    return () => {
      controller.abort();
    };
  }, [todoGetList]);

  const [showAddTodoModal, setShowAddTodoModal] = useState(false);

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

      {showAddTodoModal && (
        <AddEditTodoModalProvider onClose={() => setShowAddTodoModal(false)} />
      )}
      {isFetching && <div>Loading...</div>}
      {hasError && <div>Something went wrong...</div>}
      {isFetched && todos && (
        <TodoList
          items={todos}
          filterFields={filterFields}
          initialValues={initialFilterValues}
        />
      )}
    </div>
  );
};

export default Todos;
