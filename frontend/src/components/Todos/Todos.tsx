import { TodoInterface } from "src/Types";
import { useTypedSelector } from "src/hooks/useTypedSelector";

import AddTodo from "./AddTodo";

const Todos: React.FC = () => {
  const todos = useTypedSelector((state) => state.todo);
  return (
    <div>
      <AddTodo />
      {todos.map((todo: TodoInterface) => (
        <div key={todo.uid}>
          {todo.uid} {todo.title}
        </div>
      ))}
    </div>
  );
};

export default Todos;
