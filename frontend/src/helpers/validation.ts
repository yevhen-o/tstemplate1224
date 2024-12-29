import memoize from "memoize-one";
import getTypedKeys from "./getTypedKeys";

type BaseFunction = (...args: any[]) => any; // eslint-disable-line @typescript-eslint/no-explicit-any

export type Value =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | object;
export type Rule = {
  hasLength?: number;
  hasLetters?: boolean;
  hasUpperLetter?: boolean;
  isAlreadyExistsInArray?: string[];
  isArray?: boolean;
  isChecked?: boolean;
  isEmail?: boolean;
  isObject?: boolean;
  isPhone?: boolean;
  isRequired?: boolean;
  isUrl?: boolean;
  lettersNumbersOnly?: boolean;
  lettersOnly?: boolean;
  maxLength?: number;
  maxNumber?: number;
  minLength?: number;
  minNumber?: number;
  numbersOnly?: boolean;
  numbersWithDecimalOnly?: boolean;
};
export type ErrorMessage = string | null;
type Validity = {
  errorMessage: ErrorMessage;
  isValid: boolean;
};

export const regex = {
  hasUpperCase: /(?=.*[A-Z])/,
  lettersOnly: /^[A-Za-z ]+$/,
  lettersNumbersOnly: /^[A-Za-z0-9-]+$/,
  numbersOnly: /^\d+$/,
  hasLetters: /[a-z]+/i,
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  phone: /^[\d\s()-]+$/,
  numbersWithDecimalOnly: /^[1-9]\d*(\.\d+)?$/,
  url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9_]-*)*[a-z\u00a1-\uffff0-9_]+)(?:\.(?:[a-z\u00a1-\uffff0-9_]-*)*[a-z\u00a1-\uffff0-9_]+)*(?:\.(?:[a-z\u00a1-\uffff_]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,
};

const isString = (value: Value): value is string => typeof value === "string";

const isNumber = (value: Value): value is number => typeof value === "number";

const hasValue = (value: Value): boolean => {
  if (value === null || value === undefined) return false;
  if (isString(value)) return value.trim() !== "";
  if (Array.isArray(value)) return value.length > 0;
  if (typeof value === "object") return Object.keys(value).length > 0;
  return true;
};

export const checkValidity = (
  value: Value,
  rules: Rule | null | undefined
): Validity => {
  const validation: Validity = {
    errorMessage: null,
    isValid: true,
  };

  if (rules) {
    if (rules.isRequired && validation.isValid) {
      if (!hasValue(value)) {
        validation.isValid = false;
      }
      validation.errorMessage = !validation.isValid
        ? "This field is required"
        : null;
    }
    if (validation.isValid && rules.hasLength) {
      if (
        !hasValue(value) ||
        !isString(value) ||
        value.length < rules.hasLength
      ) {
        validation.isValid = false;
        validation.errorMessage = `This field is too short ${rules.hasLength} characters`;
      }
    }
    if (rules.hasUpperLetter && validation.isValid) {
      validation.isValid = !isString(value) || regex.hasUpperCase.test(value);

      validation.errorMessage = !validation.isValid
        ? "Should contain at least one upper case letter"
        : null;
    }
    if (rules.lettersOnly && validation.isValid) {
      validation.isValid = !isString(value) || regex.lettersOnly.test(value);

      if (isString(value) && value.trim().length === 0 && !rules.isRequired) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? "Only Letters are Allowed"
        : null;
    }
    if (rules.lettersNumbersOnly && validation.isValid) {
      validation.isValid =
        !isString(value) || regex.lettersNumbersOnly.test(value);

      if (isString(value) && value.trim().length === 0 && !rules.isRequired) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? "Only Letters Numbers Dashes are Allowed"
        : null;
    }
    if (rules.numbersOnly && validation.isValid) {
      validation.isValid =
        isNumber(value) || (isString(value) && regex.numbersOnly.test(value));

      if (
        (isString(value) || isNumber(value)) &&
        `${value}`.trim().length === 0 &&
        !rules.isRequired
      ) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? "Only Numbers are Allowed"
        : null;
    }
    if (rules.hasLetters && validation.isValid) {
      validation.isValid =
        !isString(value) || regex.hasLetters.test(value.toLowerCase());

      if (isString(value) && value.trim().length === 0 && !rules.isRequired) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? "Please Enter At Least One Letter"
        : null;
    }
    if (rules.minLength && validation.isValid) {
      validation.isValid =
        isString(value) && value.trim().length >= rules.minLength;

      if (isString(value) && value.trim().length === 0 && !rules.isRequired) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? `To Short MinLength ${rules.minLength} characters`
        : null;
    }
    if (rules.maxLength && validation.isValid) {
      validation.isValid =
        (isString(value) || isNumber(value)) &&
        `${value}`.trim().length <= rules.maxLength;

      if (
        (isString(value) || isNumber(value)) &&
        `${value}`.trim().length === 0 &&
        !rules.isRequired
      ) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? `To Long MaxLength ${rules.maxLength} characters`
        : null;
    }
    if (rules.maxNumber && validation.isValid) {
      validation.isValid =
        (isNumber(value) || isString(value)) &&
        +`${value}`.trim() <= rules.maxNumber;

      if (
        (isString(value) || isNumber(value)) &&
        `${value}`.trim().length === 0 &&
        !rules.isRequired
      ) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? `To Long MaxInt ${rules.maxNumber}`
        : null;
    }
    if (rules.minNumber && validation.isValid) {
      validation.isValid =
        (isString(value) || isNumber(value)) &&
        +`${value}`.trim() >= rules.minNumber;

      if (
        (isString(value) || isNumber(value)) &&
        `${value}`.trim().length === 0 &&
        !rules.isRequired
      ) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? `To low min value ${rules.minNumber}`
        : null;
    }
    if (rules.isEmail && validation.isValid) {
      validation.isValid =
        isString(value) && regex.email.test(value.toLowerCase());
      if (isString(value) && value.trim().length === 0 && !rules.isRequired) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? "Please provide correct email."
        : null;
    }
    if (rules.isPhone && validation.isValid) {
      const isValid = isString(value) && regex.phone.test(value);
      if (!isValid) {
        validation.isValid = false;
      } else {
        const phone = (value || "").replace(/\D/g, "");
        validation.isValid = phone.length >= 7;
      }

      if (isString(value) && value.trim().length === 0 && !rules.isRequired) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? "Invalid number. Make sure your number is correct"
        : null;
    }
    if (rules.isChecked && validation.isValid) {
      validation.isValid =
        (typeof value === "boolean" && value) ||
        (isString(value) && value === "true");
      validation.errorMessage = !validation.isValid
        ? "This field is required"
        : null;
    }
    if (rules.isObject && validation.isValid) {
      validation.isValid = typeof value === "object";
      validation.errorMessage = !validation.isValid
        ? "This field is required"
        : null;
    }
    if (rules.isArray && validation.isValid) {
      validation.isValid = Array.isArray(value) && value.length > 0;
      validation.errorMessage = !validation.isValid
        ? "This field is required"
        : null;
    }

    if (rules.numbersWithDecimalOnly && validation.isValid) {
      validation.isValid =
        (isString(value) || isNumber(value)) &&
        regex.numbersWithDecimalOnly.test(String(value).toLowerCase());

      if (
        (isString(value) || isNumber(value)) &&
        `${value}`.trim().length === 0 &&
        !rules.isRequired
      ) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? "Only Numbers And Decimals are Allowed"
        : null;
    }

    if (rules.isUrl && validation.isValid && value !== "") {
      validation.isValid = Boolean(isString(value) && regex.url.test(value));
      validation.errorMessage = !validation.isValid ? "Enter Valid Url" : null;
    }

    if (rules.isAlreadyExistsInArray && validation.isValid) {
      validation.isValid = !(
        rules.isAlreadyExistsInArray.filter(
          (e) => e.toLowerCase() === String(value).toLowerCase()
        ).length > 0
      );
      validation.errorMessage = !validation.isValid
        ? `Item Already Exists, ${value}`
        : null;
    }
  }
  return validation;
};

type Values = Record<string, Value>;
export type Rules<V extends Values = Values> = Partial<Record<keyof V, Rule>>;
export type ValidationErrors<V extends Values = Values> = Partial<
  Record<keyof V, ErrorMessage>
>;

const getValidationErrorsUnMemoized = <V extends Values = Values>(
  values: V,
  validation: Rules<V>
): ValidationErrors<V> =>
  getTypedKeys(validation).reduce<ValidationErrors<V>>((result, key) => {
    const validationResult = { ...result };
    validationResult[key] = checkValidity(
      values[key],
      validation[key]
    ).errorMessage;
    return validationResult;
  }, {});

type MemoizeGeneric = <F extends BaseFunction>(fn: F) => F;
export const getValidationErrors = (memoize as MemoizeGeneric)(
  getValidationErrorsUnMemoized
);
