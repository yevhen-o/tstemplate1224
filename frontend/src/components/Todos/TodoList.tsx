import { TodoInterface } from "src/Types";
import { formatDate } from "src/helpers/formatDate";
import { Link, getUrl, IDENTIFIERS } from "src/helpers/urlsHelper";
import withPagination from "src/hocs/withPagination";

interface TodoListProps {
  itemsToDisplay: TodoInterface[];
}

const TodoList: React.FC<TodoListProps> = ({ itemsToDisplay }) => {
  return (
    <div className="px-8">
      {itemsToDisplay.map((todo: TodoInterface) => (
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

export default withPagination(TodoList);
