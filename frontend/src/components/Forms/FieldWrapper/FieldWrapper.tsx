import { HTMLProps } from "react";
import classNames from "classnames";
import "./FieldWrapper.scss";

interface FieldWrapperProps extends HTMLProps<HTMLInputElement> {
  children: React.ReactNode;
  errorMessage?: string;
  isTouched?: boolean;
  isDirty?: boolean;
  isErrorMessageHidden?: boolean;
  isThin?: boolean;
}

export const FieldWrapper = (props: FieldWrapperProps) => {
  const {
    children,
    errorMessage,
    isTouched,
    isDirty,
    isErrorMessageHidden = false,
    isThin = false,
  } = props;

  return (
    <div
      className={classNames("field_wrapper", {
        "field_wrapper--thin": isThin,
        "field_wrapper--error": errorMessage && isTouched,
        "field_wrapper--success": !errorMessage && isDirty,
      })}
    >
      {children}
      {!isErrorMessageHidden && errorMessage && isTouched && (
        <small>{errorMessage}</small>
      )}
    </div>
  );
};
