import { useCallback, useEffect, useState } from "react";
import { createSelector } from "reselect";
import { useActions } from "src/hooks/useActions";
import { useTypedSelector } from "src/hooks/useTypedSelector";
import AddTodoModal from "./AddEditTodoModal";
import Button from "src/components/Buttons";
import TodoList from "./TodoList";
import Filters from "../Filters/Filters";

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
    todoGetList();
  }, [todoGetList]);

  const [showAddTodoModal, setShowAddTodoModal] = useState(false);

  const handleCloseModal = useCallback(() => {
    setShowAddTodoModal(false);
  }, [setShowAddTodoModal]);

  return (
    <div className="px-8">
      <Button isPrimary onClick={() => setShowAddTodoModal(true)}>
        Add Todo
      </Button>

      <Filters />

      {showAddTodoModal && <AddTodoModal onClose={handleCloseModal} />}
      {isFetching && <div>Loading...</div>}
      {hasError && <div>Something went wrong...</div>}
      {isFetched && todos && <TodoList items={todos} />}
    </div>
  );
};

export default Todos;
