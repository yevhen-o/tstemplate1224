import memoize from "memoize-one";
import getTypedKeys from "../getTypedKeys";
import type { Rule } from "./constants";
import type {
  Value,
  Values,
  Rules,
  ValidationErrors,
} from "src/Types/FormTypes";
import { Validity, RuleValidators } from "./validationFunction";

type BaseFunction = (...args: any[]) => any; // eslint-disable-line @typescript-eslint/no-explicit-any

type CustomRule = (value: Value, values?: Values) => Validity;

export type ExtendedRule = Rule & {
  customRules?: CustomRule[];
};

export const checkValidity = (
  value: Value,
  rules: ExtendedRule | null | undefined,
  values?: Values
): Validity => {
  if (!rules) return { isValid: true, errorMessage: null };

  for (const key of Object.keys(rules) as (keyof Rule)[]) {
    const ruleValue = rules[key];
    const validator = RuleValidators[key];
    if (validator) {
      const result = validator(value, ruleValue, rules.isRequired);
      if (!result.isValid) return result; // Return early on failure
    }
  }
  if (rules?.customRules) {
    for (const customRule of rules.customRules) {
      const result = customRule(value, values);
      if (!result.isValid) return result;
    }
  }

  return { isValid: true, errorMessage: null };
};

const getValidationErrorsUnMemoized = <V extends Values = Values>(
  values: V,
  validation: Rules<V>
): ValidationErrors<V> =>
  getTypedKeys(validation).reduce<ValidationErrors<V>>((result, key) => {
    const validationResult = { ...result };
    validationResult[key] = checkValidity(
      values[key],
      validation[key],
      values
    ).errorMessage;
    return validationResult;
  }, {});

type MemoizeGeneric = <F extends BaseFunction>(fn: F) => F;
export const getValidationErrors = (memoize as MemoizeGeneric)(
  getValidationErrorsUnMemoized
);
