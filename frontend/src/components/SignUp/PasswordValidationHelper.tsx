import classNames from "classnames";
import {
  passwordDigitSchema,
  passwordUppercaseSchema,
  passwordLengthAndNoSpacesSchema,
} from "./PasswordValidationSchemas";

const PasswordValidationHelper = ({
  value,
  isTouched,
}: {
  value: string;
  isTouched?: boolean;
}) => {
  const hasPasswordRequiredLength =
    passwordLengthAndNoSpacesSchema.safeParse(value);
  const hasPasswordLetters = passwordUppercaseSchema.safeParse(value);
  const hasPasswordDigits = passwordDigitSchema.safeParse(value);
  return (
    <>
      <span
        className={classNames({
          "field-help-text--error":
            isTouched && !hasPasswordRequiredLength.success,
          "field-help-text--success": hasPasswordRequiredLength.success,
        })}
      >
        <small>8 characters or more (no spaces)</small>
      </span>
      <span
        className={classNames({
          "field-help-text--error": isTouched && !hasPasswordLetters.success,
          "field-help-text--success": hasPasswordLetters.success,
        })}
      >
        <small>Uppercase and lowercase letters</small>
      </span>
      <span
        className={classNames({
          "field-help-text--error": isTouched && !hasPasswordDigits.success,
          "field-help-text--success": hasPasswordDigits.success,
        })}
      >
        <small>At least one digit</small>
      </span>
    </>
  );
};

export default PasswordValidationHelper;
