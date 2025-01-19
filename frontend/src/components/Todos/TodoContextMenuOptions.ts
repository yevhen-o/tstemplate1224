import { TodoInterface } from "src/Types";

export const getContextMenuOptions = (item: TodoInterface) => [
  {
    label: "Do something",
    value: "1",
    onClick: (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      item: TodoInterface | null
    ) => console.log(1, item),
    disabled: item.uid === "ecfkrupyb0n",
  },
  {
    label: "Do something 2",
    value: "1",
    onClick: (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      item: TodoInterface | null
    ) => console.log(2, item),
    disabled: item.uid === "ytqi6obpe",
  },
  {
    label: "Do something  3",
    value: "1",
    onClick: (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      item: TodoInterface | null
    ) => console.log(3, item),
    disabled: item.uid === "ham5pj2r2kc",
  },
  {
    isDivider: true,
    label: "divider",
    value: "divider",
    onClick: (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      item: TodoInterface | null
    ) => console.log(4, item),
  },
  {
    label: "Do something 4",
    value: "1",
    onClick: (
      e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
      item: TodoInterface | null
    ) => console.log(5, item),
    disabled: item.uid === "7pa9u2ir8pe",
  },
];
