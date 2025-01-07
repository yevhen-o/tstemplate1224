import { useRef, useState } from "react";
import { TodoInterface } from "src/Types";
import { formatDate } from "src/helpers/formatDate";
import { Link, getUrl, IDENTIFIERS } from "src/services/urlsHelper";
import { withFilters, withPagination } from "src/hocs";
import ContextMenu from "../ContextMenu";

interface TodoListProps {
  items: TodoInterface[];
}

const contextMenuOptions = [
  {
    label: "Do something",
    onClick: () => console.log(1),
  },
  {
    label: "Do something",
    onClick: () => console.log(2),
  },
  {
    label: "Do something",
    onClick: () => console.log(3),
  },
  {
    isDivider: true,
    label: "divider",
    onClick: () => console.log("click on divider"),
  },
  {
    label: "Do something",
    onClick: () => console.log(4),
  },
];

const TodoList: React.FC<TodoListProps> = ({ items }) => {
  const contextMenuRef = useRef<HTMLElement | null>(null);
  const [contextMenu, setContextMenu] = useState({
    position: {
      x: 0,
      y: 0,
    },
    item: {},
    isToggled: false,
  });
  const handleOpenContextMenu =
    (item: TodoInterface) =>
    (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      const element = contextMenuRef.current;
      if (element instanceof HTMLElement) {
        const contextMenuRect = element.getBoundingClientRect();
        const isLeft = e.clientX < window?.innerWidth / 2;

        let x;
        let y = e.clientY;
        if (isLeft) {
          x = e.clientX;
        } else {
          x = e.clientX - contextMenuRect.width;
        }

        setContextMenu({
          position: {
            x,
            y,
          },
          item: item,
          isToggled: true,
        });
      }
    };

  const resetContextMenu = () => {
    setContextMenu({
      position: {
        x: 0,
        y: 0,
      },
      item: {},
      isToggled: false,
    });
  };

  return (
    <div className="px-8">
      {items.map((todo: TodoInterface) => (
        <Link
          to={getUrl(IDENTIFIERS.TODO_VIEW, { todoId: todo.uid })}
          className="rounded-lg block bg-white text-left shadow-xl px-4 py-3 border border-gray-200 my-4"
          key={todo.uid}
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
      <ContextMenu
        resetContextMenu={resetContextMenu}
        rightClickItem={contextMenu.item}
        contextMenuRef={contextMenuRef}
        isToggled={contextMenu.isToggled}
        positionX={contextMenu.position.x}
        positionY={contextMenu.position.y}
        options={contextMenuOptions}
      />
    </div>
  );
};
export default withFilters(withPagination(TodoList));
