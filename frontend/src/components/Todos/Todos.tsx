import { useCallback, useEffect, useState } from "react";
import { createSelector } from "reselect";
import { TodoInterface } from "src/Types";
import { useActions } from "src/hooks/useActions";
import { useTypedSelector } from "src/hooks/useTypedSelector";
import AddTodoModal from "./AddEditTodoModal";
import Button from "src/components/Buttons";
import { formatDate } from "src/helpers/formatDate";
import { Link, getUrl, IDENTIFIERS } from "src/helpers/urlsHelper";

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
      {showAddTodoModal && <AddTodoModal onClose={handleCloseModal} />}
      {isFetching && <div>Loading...</div>}
      {hasError && <div>Something went wrong...</div>}
      {isFetched &&
        todos &&
        todos.map((todo: TodoInterface) => (
          <Link
            to={getUrl(IDENTIFIERS.TODO_VIEW, { todoId: todo.uid })}
            className="rounded-lg block bg-white text-left shadow-xl px-4 py-3 border border-gray-200 my-4"
            key={todo.uid}
          >
            <strong>ID: </strong>
            {todo.uid}
            <br />
            <strong>Title: </strong>
            {todo.title}
            <br />
            <strong>Deadline: </strong>
            {formatDate(todo.deadline)}
            <br />
          </Link>
        ))}
    </div>
  );
};

export default Todos;
