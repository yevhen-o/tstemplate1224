import { nanoid } from "@reduxjs/toolkit";

import Button from "../Buttons";
import type { ButtonProps } from "../Buttons/Buttons";
import "./DropDownCss.scss";
import { useMemo } from "react";
import classNames from "classnames";

interface DropDownCssProps extends ButtonProps {
  children: React.ReactNode;
  className?: string;
  options: {
    label: string;
    value: string;
    onClick: () => void;
    disabled?: boolean;
  }[];
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
        //@ts-expect-error New anchorName css property
        style={{ anchorName: `--anchor__${menuId}` }}
        //@ts-expect-error New css Target propperty
        popoverTarget={menuId}
        id={`anchor__${menuId}`}
        className={classNames("drop-down-menu-button", className)}
        {...restProps}
      >
        {children}
      </Button>
      <dialog
        //@ts-expect-error  New anchorName css property
        style={{ positionAnchor: `--anchor__${menuId}` }}
        id={menuId}
        //@ts-expect-error Popower auto by default
        popover="auto"
        className={classNames("profile-menu rounded-md", className)}
      >
        {options.map(({ label, onClick, value, disabled }, index) => {
          return (
            <button
              key={`${label}__${value}__${index}`}
              onClick={onClick}
              disabled={disabled}
            >
              {label}
            </button>
          );
        })}
      </dialog>
    </>
  );
};

export default DropDownCss;
