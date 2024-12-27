import memoize from "memoize-one";
import getTypedKeys from "./getTypedKeys";

type BaseFunction = (...args: any[]) => any; // eslint-disable-line @typescript-eslint/no-explicit-any

type Value = string | null | undefined;
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
      validation.isValid = !!value && String(value).trim() !== "";
      validation.errorMessage = !validation.isValid
        ? "This field is required"
        : null;
    }
    if (validation.isValid && rules.hasLength) {
      if (value && value.length < rules.hasLength) {
        validation.isValid = false;
        validation.errorMessage = "The password must be at least 8 characters";
      }
    }
    if (rules.hasUpperLetter && validation.isValid) {
      const lettersRegExp = /(?=.*[A-Z])/;
      validation.isValid = lettersRegExp.test(String(value));

      validation.errorMessage = !validation.isValid
        ? "Should contain at least one upper case letter"
        : null;
    }
    if (rules.lettersOnly && validation.isValid) {
      const lettersRegExp = /^[A-Za-z ]+$/;
      validation.isValid = lettersRegExp.test(String(value).toLowerCase());

      if (value && value.trim().length === 0 && !rules.isRequired) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? "Only Letters are Allowed"
        : null;
    }
    if (rules.lettersNumbersOnly && validation.isValid) {
      const lettersRegExp = /^[A-Za-z0-9-]+$/;
      validation.isValid = lettersRegExp.test(String(value).toLowerCase());

      if (value && value.trim().length === 0 && !rules.isRequired) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? "Only Letters Numbers Dashes are Allowed"
        : null;
    }
    if (rules.numbersOnly && validation.isValid) {
      const numbersRegExp = /^\d+$/;
      validation.isValid = numbersRegExp.test(String(value));

      if (`${value}`.trim().length === 0 && !rules.isRequired) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? "Only Numbers are Allowed"
        : null;
    }
    if (rules.hasLetters && validation.isValid) {
      const hasLettersRegExp = /[a-z]+/i;
      validation.isValid = hasLettersRegExp.test(String(value).toLowerCase());

      if (value && value.trim().length === 0 && !rules.isRequired) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? "Please Enter At Least One Letter"
        : null;
    }
    if (rules.minLength && validation.isValid) {
      validation.isValid = Boolean(
        value && value.trim().length >= rules.minLength
      );

      if (value && value.trim().length === 0 && !rules.isRequired) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? `To Short MinLength ${rules.minLength} characters`
        : null;
    }
    if (rules.maxLength && validation.isValid) {
      validation.isValid = `${value}`.trim().length <= rules.maxLength;

      if (`${value}`.trim().length === 0 && !rules.isRequired) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? `To Long MaxLength ${rules.maxLength} characters`
        : null;
    }
    if (rules.maxNumber && validation.isValid) {
      validation.isValid = +`${value}`.trim() <= rules.maxNumber;

      if (`${value}`.trim().length === 0 && !rules.isRequired) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? `To Long MaxInt ${rules.maxNumber}`
        : null;
    }
    if (rules.minNumber && validation.isValid) {
      validation.isValid = +`${value}`.trim() >= rules.minNumber;

      if (`${value}`.trim().length === 0 && !rules.isRequired) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? `To low min value ${rules.minNumber}`
        : null;
    }
    if (rules.isEmail && validation.isValid) {
      const emailRegExp =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      validation.isValid = emailRegExp.test(String(value).toLowerCase());
      if (value && value.trim().length === 0 && !rules.isRequired) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? "Please provide correct email."
        : null;
    }
    if (rules.isPhone && validation.isValid) {
      const phoneRegex = /^[\d\s()-]+$/;
      const isValid = value && phoneRegex.test(value);
      if (!isValid) {
        validation.isValid = false;
      } else {
        const phone = (value || "").replace(/\D/g, "");
        validation.isValid = phone.length >= 7;
      }

      if (value && value.trim().length === 0 && !rules.isRequired) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? "Invalid number. Make sure your number is correct and that you've selected the proper country from the drop down list. Do not include your country code in your number."
        : null;
    }
    if (rules.isChecked && validation.isValid) {
      validation.isValid = Boolean(value);
      validation.errorMessage = !validation.isValid
        ? "This field is required"
        : null;
    }
    if (rules.isObject && validation.isValid) {
      validation.isValid = Boolean(value) && typeof value === "object";
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
      const regexp = /^[1-9]\d*(\.\d+)?$/;
      validation.isValid = regexp.test(String(value).toLowerCase());

      if (`${value}`.trim().length === 0 && !rules.isRequired) {
        validation.isValid = true;
      }

      validation.errorMessage = !validation.isValid
        ? "Only Numbers And Decimals are Allowed"
        : null;
    }

    if (rules.isUrl && validation.isValid && value !== "") {
      const regexp =
        /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9_]-*)*[a-z\u00a1-\uffff0-9_]+)(?:\.(?:[a-z\u00a1-\uffff0-9_]-*)*[a-z\u00a1-\uffff0-9_]+)*(?:\.(?:[a-z\u00a1-\uffff_]{2,})))(?::\d{2,5})?(?:\/\S*)?$/;
      validation.isValid = Boolean(value && regexp.test(value));
      validation.errorMessage = !validation.isValid ? "Enter Valid Url" : null;
    }

    if (rules.isAlreadyExistsInArray && validation.isValid) {
      validation.isValid = !(
        rules.isAlreadyExistsInArray.filter((e) =>
          Boolean(value && e.toLowerCase() === value.toLocaleLowerCase())
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
