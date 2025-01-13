import { nanoid } from "@reduxjs/toolkit";

import Button from "../Buttons";
import type { ButtonProps } from "../Buttons/Buttons";
import "./DropDownCss.scss";
import { useMemo } from "react";
import classNames from "classnames";

interface DropDownCssProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
  options: { label: string; value: string; onClick: () => void }[];
}

const DropDownCss: React.FC<DropDownCssProps> = ({
  children,
  options,
  className,
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
        className={classNames("drop-down-menu-button", className)}
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
        className={classNames("profile-menu rounded-md", className)}
      >
        {options.map(({ label, onClick, value }, index) => {
          return (
            <button key={`${label}__${value}__${index}`} onClick={onClick}>
              {label}
            </button>
          );
        })}
      </dialog>
    </>
  );
};

export default DropDownCss;
