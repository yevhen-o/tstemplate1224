import classNames from "classnames";
import React from "react";

type Props = {
  className?: string;
  isValid?: boolean;
  id: string;
  children?: React.ReactNode;
};

const FieldLabel: React.FC<Props> = ({
  children,
  className,
  isValid = true,
  id,
}) => (
  <label
    htmlFor={id}
    className={classNames(
      "block text-sm/6 font-medium text-gray-900",
      className,
      { "text-red-500": !isValid }
    )}
  >
    {children}
  </label>
);

export default FieldLabel;
