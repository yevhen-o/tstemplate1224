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

export const regex = {
  hasUpperCase: /(?=.*[A-Z])/,
  lettersOnly: /^[A-Za-z ]+$/,
  lettersNumbersOnly: /^[A-Za-z0-9-]+$/,
  numbersOnly: /^\d+$/,
  hasLetters: /[a-z]+/i,
  email:
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
  phone: /^(?:\D*\d){7,}\D*$/,
  numbersWithDecimalOnly: /^[1-9]\d*(\.\d+)?$/,
  url: /^(?:(?:https?|ftp):\/\/)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9_]-*)*[a-z\u00a1-\uffff0-9_]+)(?:\.(?:[a-z\u00a1-\uffff0-9_]-*)*[a-z\u00a1-\uffff0-9_]+)*(?:\.(?:[a-z\u00a1-\uffff_]{2,})))(?::\d{2,5})?(?:\/\S*)?$/,
};

export const errorMessages = {
  isRequired: "This field is required",
  hasUpperLetter: "Should contain at least one upper case letter",
  lettersOnly: "Only Letters are Allowed",
  lettersNumbersOnly: "Only Letters Numbers Dashes are Allowed",
  numbersOnly: "Only Numbers are Allowed",
  hasLetters: "Please Enter At Least One Letter",
  email: "Please provide a valid email address",
  isPhone: "Please provide a valid phone number",
  isChecked: "This field is required",
  isObject: "This field is required",
  isArray: "This field is required",
  numbersWithDecimalOnly: "Only Numbers And Decimals are Allowed",
  isUrl: "Enter Valid Url",
  hasLength: (length: number) =>
    `This field must be exact ${length} characters`,
  minLength: (length: number) =>
    `This field must be no less than ${length} characters`,
  maxLength: (length: number) =>
    `This field must be no more than ${length} characters`,
  maxNumber: (maxNumber: number) => `To Long MaxInt ${maxNumber}`,
  minNumber: (minNumber: number) => `To low min value ${minNumber}`,
  isAlreadyExistsInArray: (value: string) => `Item Already Exists, ${value}`,
};
