import classNames from "classnames";
import { useOutsideClick } from "src/hooks";
import "./ContextMenu.scss";
import { OptionType } from "src/Types/FormTypes";
import DropDownItem from "src/components/DropDown/DropDownItem";

interface ContextMenuProps<T> {
  rightClickItem: T | null;
  positionX: number;
  positionY: number;
  isToggled: boolean;
  options: ContextMenuOptionType<T>[];
  contextMenuRef: React.MutableRefObject<HTMLElement | null>;
  resetContextMenu: () => void;
}

export type ContextMenuOptionType<T> = OptionType & {
  onClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    i: T | null
  ) => void;
  disabled?: boolean;
};

const ContextMenu = <T extends object>({
  rightClickItem,
  positionX,
  positionY,
  isToggled,
  options,
  contextMenuRef,
  resetContextMenu,
}: ContextMenuProps<T>) => {
  const handleClick =
    (option: ContextMenuOptionType<T>) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      option.onClick(e, rightClickItem);
      resetContextMenu();
    };

  useOutsideClick(contextMenuRef, resetContextMenu, true, "mousedown");

  return (
    <menu
      style={{
        top: `${positionY + 2}px`,
        left: `${positionX + 2}px`,
      }}
      className={classNames("context-menu", { active: isToggled })}
      ref={contextMenuRef}
    >
      {options.map((option, index) => {
        if (option.isDivider) return <hr key={index} />;
        return (
          <DropDownItem
            handleClose={resetContextMenu}
            handleClick={() => handleClick(option)}
            activeIndex={-1}
            index={index}
            item={{ ...option, onClick: handleClick(option) }}
            key={index}
          />
        );
      })}
    </menu>
  );
};

export default ContextMenu;
