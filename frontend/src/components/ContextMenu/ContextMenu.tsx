import classNames from "classnames";
import { useOutsideClick } from "src/hooks";
import "./ContextMenu.scss";

interface ContextMenuProps {
  rightClickItem: any;
  positionX: number;
  positionY: number;
  isToggled: boolean;
  options: Option[];
  contextMenuRef: React.MutableRefObject<HTMLElement | null>;
  resetContextMenu: () => void;
}

interface Option {
  label: string;
  isSpacer?: boolean;
  onClick: (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
    rightClickItem: any
  ) => void;
}

const ContextMenu: React.FC<ContextMenuProps> = ({
  rightClickItem,
  positionX,
  positionY,
  isToggled,
  options,
  contextMenuRef,
  resetContextMenu,
}) => {
  const handleClick =
    (option: Option) =>
    (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
      e.stopPropagation();
      option.onClick(e, rightClickItem);
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
        if (option.isSpacer) return <hr key={index} />;
        return (
          <button key={index} onClick={handleClick(option)}>
            {option.label}
          </button>
        );
      })}
    </menu>
  );
};

export default ContextMenu;
