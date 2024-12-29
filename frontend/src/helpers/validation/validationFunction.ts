import { errorMessages, regex } from "./constants";
import type { Value, ErrorMessage } from "./constants";

export type Validity = {
  errorMessage: ErrorMessage;
  isValid: boolean;
};

const isString = (value: Value): value is string => typeof value === "string";

const isNumber = (value: Value): value is number => typeof value === "number";

const createRegexValidator =
  (regex: RegExp, errorMessage: string) =>
  (value: Value, _: any, isRequired?: boolean): Validity => {
    const isValid =
      isString(value) &&
      (regex.test(value) || valueIsStringNotRequired(value, isRequired));
    return {
      isValid,
      errorMessage: isValid ? null : errorMessage,
    };
  };

const valueIsStringNotRequired = (
  value: Value,
  isRequired: boolean | undefined
) => isString(value) && value.length === 0 && !isRequired;

const hasValue = (value: Value): boolean => {
  if (value === null || value === undefined) return false;
  if (isString(value)) return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
};

const validateIsRequired = (value: Value): Validity => ({
  isValid: hasValue(value),
  errorMessage: hasValue(value) ? null : errorMessages.isRequired,
});

const validateHasLength = (value: Value, length: number): Validity => {
  const isValid =
    (isString(value) || isNumber(value)) && `${value}`.length !== length;
  return {
    isValid,
    errorMessage: isValid ? null : errorMessages.hasLength(length),
  };
};

const validateMinLength = (
  value: Value,
  length: number,
  isRequired: boolean | undefined
): Validity => {
  const isValid =
    isString(value) &&
    (value.trim().length >= length ||
      valueIsStringNotRequired(value, isRequired));
  return {
    isValid,
    errorMessage: isValid ? null : errorMessages.minLength(length),
  };
};

const validateMaxLength = (
  value: Value,
  length: number,
  isRequired: boolean | undefined
): Validity => {
  const isValid =
    isString(value) &&
    (value.trim().length <= length ||
      valueIsStringNotRequired(value, isRequired));
  return {
    isValid,
    errorMessage: isValid ? null : errorMessages.maxLength(length),
  };
};

const validateMaxNumber = (
  value: Value,
  maxNumber: number,
  isRequired: boolean | undefined
): Validity => {
  const isValid =
    (isNumber(value) || isString(value)) &&
    (+`${value}`.trim() <= maxNumber ||
      valueIsStringNotRequired(value, isRequired));
  return {
    isValid,
    errorMessage: isValid ? null : errorMessages.maxNumber(maxNumber),
  };
};

const validateMinNumber = (
  value: Value,
  minNumber: number,
  isRequired: boolean | undefined
): Validity => {
  const isValid =
    (isNumber(value) || isString(value)) &&
    (+`${value}`.trim() >= minNumber ||
      valueIsStringNotRequired(value, isRequired));
  return {
    isValid,
    errorMessage: isValid ? null : errorMessages.minNumber(minNumber),
  };
};

const validateHasUpperLetter = createRegexValidator(
  regex.hasUpperCase,
  errorMessages.hasUpperLetter
);

const validateLettersOnly = createRegexValidator(
  regex.lettersOnly,
  errorMessages.lettersOnly
);

const validateLettersNumbersOnly = createRegexValidator(
  regex.lettersNumbersOnly,
  errorMessages.lettersNumbersOnly
);

const validateNumbersOnly = createRegexValidator(
  regex.numbersOnly,
  errorMessages.numbersOnly
);

const validateHasLetters = createRegexValidator(
  regex.hasLetters,
  errorMessages.hasLetters
);

const validateIsEmail = createRegexValidator(regex.email, errorMessages.email);

const validateIsPhone = createRegexValidator(
  regex.phone,
  errorMessages.isPhone
);

const validateIsChecked = (value: Value): Validity => {
  const isValid =
    (typeof value === "boolean" && value) ||
    (isString(value) && value === "true");
  return {
    isValid,
    errorMessage: isValid ? null : errorMessages.isChecked,
  };
};

const validateIsObject = (value: Value): Validity => {
  const isValid = typeof value === "object";
  return {
    isValid,
    errorMessage: isValid ? null : errorMessages.isObject,
  };
};

const validateIsArray = (value: Value): Validity => {
  const isValid = Array.isArray(value) && value.length > 0;
  return {
    isValid,
    errorMessage: isValid ? null : errorMessages.isArray,
  };
};

const validateNumbersWithDecimalOnly = createRegexValidator(
  regex.numbersWithDecimalOnly,
  errorMessages.numbersWithDecimalOnly
);

const validateIsUrl = createRegexValidator(regex.url, errorMessages.isUrl);

const validateIsAlreadyExistsInArray = (
  value: Value,
  array: string[]
): Validity => {
  const isValid = !array.includes(String(value).toLowerCase());
  return {
    isValid,
    errorMessage: isValid
      ? null
      : errorMessages.isAlreadyExistsInArray(String(value)),
  };
};

export const RuleValidators = {
  isRequired: validateIsRequired,
  hasLength: validateHasLength,
  minLength: validateMinLength,
  maxLength: validateMaxLength,
  maxNumber: validateMaxNumber,
  minNumber: validateMinNumber,
  hasUpperLetter: validateHasUpperLetter,
  lettersOnly: validateLettersOnly,
  lettersNumbersOnly: validateLettersNumbersOnly,
  numbersOnly: validateNumbersOnly,
  hasLetters: validateHasLetters,
  isEmail: validateIsEmail,
  isPhone: validateIsPhone,
  isChecked: validateIsChecked,
  isObject: validateIsObject,
  isArray: validateIsArray,
  numbersWithDecimalOnly: validateNumbersWithDecimalOnly,
  isUrl: validateIsUrl,
  isAlreadyExistsInArray: validateIsAlreadyExistsInArray,
};
