import { useParams } from "react-router";
import { useEffect, useState } from "react";
import { createSelector } from "@reduxjs/toolkit";

import Button from "src/components/Buttons";
import { withClientScreen } from "src/hocs";
import AddEditTodoModal from "./AddEditTodoModal";
import { useActions, useTypedSelector } from "src/hooks";
import { ClientScreenInterface } from "src/Types/ClientScreen";

type Params = {
  todoId: string;
};

const ViewTodo: React.FC<Partial<ClientScreenInterface>> = ({
  screenHeight,
  screenWidth,
}) => {
  const { todoGetItem } = useActions();
  const { todoId } = useParams<Params>();

  useEffect(() => {
    if (todoId) {
      todoGetItem({ uid: todoId });
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

  const [showEditModal, setShowEditModal] = useState(false);

  return (
    <div>
      <h1>View Todo</h1>
      <Button isPrimary onClick={() => setShowEditModal(true)}>
        Edit
      </Button>
      {showEditModal && (
        <AddEditTodoModal
          onClose={() => setShowEditModal(false)}
          propsState={todo}
        />
      )}
      {`Window innerWidth: ${screenWidth} && innerHeight ${screenHeight}`}
      <pre>{JSON.stringify(todo, null, 2)}</pre>
    </div>
  );
};

export default withClientScreen(ViewTodo);
