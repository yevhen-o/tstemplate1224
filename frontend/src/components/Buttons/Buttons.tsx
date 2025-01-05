import classNames from "classnames";
import { ForwardRefRenderFunction, PropsWithChildren, forwardRef } from "react";

export type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  isPrimary?: boolean;
  isBordered?: boolean;
  className?: string;
  id?: string;
  style?: React.CSSProperties;
};

const Button: ForwardRefRenderFunction<
  HTMLButtonElement,
  PropsWithChildren<ButtonProps>
> = (
  {
    id,
    type,
    onClick,
    children,
    disabled,
    className,
    isPrimary,
    isBordered,
    ...restProps
  },
  ref
) => {
  let classes = "text-sm/6 font-semibold text-gray-900";
  if (isPrimary) {
    classes =
      "rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600";
  } else if (isBordered) {
    classes =
      "rounded-md bg-white px-2.5 py-1.5 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50";
  }
  return (
    <button
      ref={ref}
      {...restProps}
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={classNames(classes, className)}
    >
      {children}
    </button>
  );
};

export default forwardRef(Button);
