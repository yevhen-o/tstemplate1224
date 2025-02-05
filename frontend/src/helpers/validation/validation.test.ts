import { checkValidity } from "./validation";
import type { Rule, Value } from "./constants";

describe("checkValidity", () => {
  const createTest = (
    value: Value,
    rules: Rule,
    expectedValidity: boolean,
    expectedErrorMessage: string | null
  ) => {
    const result = checkValidity(value, rules);
    expect(result.isValid).toBe(expectedValidity);
    expect(result.errorMessage).toBe(expectedErrorMessage);
  };

  test("should validate required field", () => {
    createTest("", { isRequired: true }, false, "This field is required");
    createTest("value", { isRequired: true }, true, null);
    createTest(null, { isRequired: true }, false, "This field is required");
  });

  test("should validate minimum length", () => {
    createTest(
      "abc",
      { minLength: 5 },
      false,
      "This field must be no less than 5 characters"
    );
    createTest("abcdef", { minLength: 5 }, true, null);
    createTest("", { minLength: 5 }, true, null);
  });

  test("should validate maximum length", () => {
    createTest(
      "abcdef",
      { maxLength: 5 },
      false,
      "This field must be no more than 5 characters"
    );
    createTest("abc", { maxLength: 5 }, true, null);
    createTest("", { maxLength: 5 }, true, null);
  });

  test("should validate if field contains uppercase letters", () => {
    createTest(
      "abc",
      { hasUpperLetter: true },
      false,
      "Should contain at least one upper case letter"
    );
    createTest("Abc", { hasUpperLetter: true }, true, null);
    createTest("", { hasUpperLetter: true }, true, null);
  });

  test("should validate letters only", () => {
    createTest("123", { lettersOnly: true }, false, "Only Letters are Allowed");
    createTest("abc", { lettersOnly: true }, true, null);
    createTest("", { lettersOnly: true }, true, null);
  });

  test("should validate letters and numbers only", () => {
    createTest("abc-123", { lettersNumbersOnly: true }, true, null);
    createTest("", { lettersNumbersOnly: true }, true, null);
    createTest(
      "abc@123",
      { lettersNumbersOnly: true },
      false,
      "Only Letters Numbers Dashes are Allowed"
    );
  });

  test("should validate numbers only", () => {
    createTest("123", { numbersOnly: true }, true, null);
    createTest("", { numbersOnly: true }, true, null);
    createTest("abc", { numbersOnly: true }, false, "Only Numbers are Allowed");
  });

  test("should validate emails", () => {
    createTest(
      "invalid-email",
      { isEmail: true },
      false,
      "Please provide a valid email address"
    );
    createTest("test@example.com", { isEmail: true }, true, null);
    createTest("", { isEmail: true }, true, null);
  });

  test("should validate phone numbers", () => {
    createTest(
      "1 2 3-4 5 6",
      { isPhone: true },
      false,
      "Please provide a valid phone number"
    );
    createTest("(123) 456-7890", { isPhone: true }, true, null);
    createTest("", { isPhone: true }, true, null);
  });

  test("should validate URLs", () => {
    createTest("invalid-url", { isUrl: true }, false, "Enter Valid Url");
    createTest("http://example.com", { isUrl: true }, true, null);
    createTest("", { isUrl: true }, true, null);
  });

  test("should validate minimum and maximum numbers", () => {
    createTest(10, { minNumber: 20 }, false, "To low min value 20");
    createTest(30, { maxNumber: 20 }, false, "To Long MaxInt 20");
    createTest(15, { minNumber: 10, maxNumber: 20 }, true, null);
    createTest("", { minNumber: 10, maxNumber: 20 }, true, null);
  });

  test("should validate if already exists in array", () => {
    createTest(
      "test",
      { isAlreadyExistsInArray: ["test", "sample"] },
      false,
      "Item Already Exists, test"
    );
    createTest(
      "unique",
      { isAlreadyExistsInArray: ["test", "sample"] },
      true,
      null
    );
  });

  test("should validate array presence", () => {
    createTest([], { isArray: true }, false, "This field is required");
    createTest([1, 2, 3], { isArray: true }, true, null);
  });

  test("should validate object presence", () => {
    createTest("", { isObject: true }, false, "This field is required");
    createTest({ key: "value" }, { isObject: true }, true, null);
  });
});
