import { TodoInterface } from "src/Types";
import { useTypedSelector } from "src/hooks/useTypedSelector";
import { createSelector } from "reselect";

import AddTodo from "./AddTodo";
import { useActions } from "src/hooks/useActions";
import { useEffect } from "react";

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
    console.log("Fetching todos");
  }, [todoGetList]);

  return (
    <div className="px-8">
      <AddTodo />
      {isFetching && <div>Loading...</div>}
      {hasError && <div>Something went wrong...</div>}
      {isFetched &&
        todos &&
        todos.map((todo: TodoInterface) => (
          <div
            className="rounded-lg bg-white text-left shadow-xl px-4 py-3 border border-gray-200 my-4"
            key={todo.uid}
          >
            <strong>ID: </strong>
            {todo.uid}
            <br />
            <strong>Title: </strong>
            {todo.title}
            <br />
            <strong>Priority: </strong>
            {todo.priority}
            <br />
            <strong>Is completed: </strong>
            {todo.isCompleted ? "Yes" : "No"}
            <br />
            <strong>Deadline: </strong>
            {todo.deadline}
            <br />
          </div>
        ))}
    </div>
  );
};

export default Todos;
