import { nanoid } from "@reduxjs/toolkit";

import Button from "../Buttons";
import type { ButtonProps } from "../Buttons/Buttons";
import "./DropDownCss.scss";
import { useMemo } from "react";

interface DropDownCssProps extends ButtonProps {
  children: React.ReactNode;
  options: { title: string; value: string; onClick: () => void }[];
}

const DropDownCss: React.FC<DropDownCssProps> = ({
  children,
  options,
  ...restProps
}) => {
  const menuId = useMemo(nanoid, []);

  return (
    <>
      <Button
        //@ts-ignore
        style={{ anchorName: `--anchor__${menuId}` }}
        //@ts-ignore
        popoverTarget={menuId}
        id={`anchor__${menuId}`}
        className="drop-down-menu-button"
        {...restProps}
      >
        {children}
      </Button>
      <dialog
        //@ts-ignore
        style={{ positionAnchor: `--anchor__${menuId}` }}
        id={menuId}
        //@ts-ignore
        popover="auto"
        className="profile-menu rounded-md"
      >
        {options.map(({ title, onClick, value }, index) => {
          return (
            <button key={`${title}__${value}__${index}`} onClick={onClick}>
              {title}
            </button>
          );
        })}
      </dialog>
    </>
  );
};

export default DropDownCss;
