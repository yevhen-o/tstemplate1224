import classNames from "classnames";

import { TodoInterface } from "src/Types";
import { formatDate } from "src/helpers/formatDate";
import { Link, getUrl, IDENTIFIERS } from "src/services/urlsHelper";
import { getContextMenuOptions } from "./TodoContextMenuOptions";

import useContextMenu from "src/hooks/useContextMenu";

interface TodoListProps {
  items: TodoInterface[];
}

const TodoList: React.FC<TodoListProps> = ({ items }) => {
  const { handleOpenContextMenu, menuPlaceholder, activeItem } = useContextMenu(
    getContextMenuOptions
  );
  return (
    <div className="px-8">
      {menuPlaceholder}
      {items.map((todo: TodoInterface) => (
        <Link
          to={getUrl(IDENTIFIERS.TODO_VIEW, { todoId: todo.uid })}
          className={classNames(
            "todoItem rounded-lg block bg-white text-left shadow-xl px-4 py-3 border border-gray-200 my-4",
            { "bg-gray-100": activeItem?.uid === todo.uid }
          )}
          key={todo.uid}
          id={todo.uid}
          onContextMenu={handleOpenContextMenu(todo)}
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
export default TodoList;
