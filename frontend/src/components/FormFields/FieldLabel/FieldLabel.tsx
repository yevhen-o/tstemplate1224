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
  <label htmlFor={id} className={"block text-sm/6 font-medium text-gray-900"}>
    {children}
  </label>
);

export default FieldLabel;
