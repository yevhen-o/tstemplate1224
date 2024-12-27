import { TodoInterface } from "src/Types";
import { useTypedSelector } from "src/hooks/useTypedSelector";

import AddTodo from "./AddTodo";

const Todos: React.FC = () => {
  const todos = useTypedSelector((state) => state.todo);
  return (
    <div className="px-8">
      <AddTodo />
      {todos.map((todo: TodoInterface) => (
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
