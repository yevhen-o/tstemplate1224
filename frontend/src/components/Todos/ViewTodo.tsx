import { useEffect } from "react";
import { useParams } from "react-router";
import { createSelector } from "@reduxjs/toolkit";

import { useActions } from "src/hooks/useActions";
import { useTypedSelector } from "src/hooks/useTypedSelector";

type ViewTodoProps = {};

type Params = {
  todoId: string;
};

const ViewTodo: React.FC<ViewTodoProps> = () => {
  const { todoGetItem } = useActions();
  const { todoId } = useParams<Params>();

  useEffect(() => {
    if (todoId) {
      todoGetItem(todoId);
    }
  }, [todoId, todoGetItem]);

  const todo = useTypedSelector((state) =>
    createSelector(
      [
        (state) => state.todo.itemsById,
        (_, todoId: string | undefined) => todoId,
      ],
      (itemsById, id) => (id ? itemsById[id] : undefined)
    )(state, todoId)
  );

  return (
    <div>
      <h1>View Todo</h1>
      <pre>{JSON.stringify(todo, null, 2)}</pre>
    </div>
  );
};

export default ViewTodo;
