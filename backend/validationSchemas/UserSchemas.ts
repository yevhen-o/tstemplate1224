export const postUserValidationSchema = {
  type: "object",
  properties: {
    firstName: { type: "string" },
    lastName: { type: "string" },
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6, maxLength: 1000 },
    confirmPassword: { type: "string" },
    age: { type: "number" },
  },
  required: ["firstName", "email", "password", "confirmPassword"],
  additionalProperties: true,
};

export const loginUserValidationSchema = {
  type: "object",
  properties: {
    email: { type: "string", format: "email" },
    password: { type: "string", minLength: 6, maxLength: 1000 },
  },
  required: ["email", "password"],
};

export const patchUserValidationSchema = {
  ...postUserValidationSchema,
  required: [],
};
