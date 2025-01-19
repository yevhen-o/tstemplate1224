import { withFilters, withPagination } from "src/hocs";
import TodoList from "./TodoList";

const TodoListWithHOC = withFilters(withPagination(TodoList));

export default TodoListWithHOC;
