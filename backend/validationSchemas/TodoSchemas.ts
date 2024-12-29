export const postTodoValidationSchema = {
  type: "object",
  properties: {
    uid: { type: "string" },
    title: { type: "string", maxLength: 10000 },
    deadline: { type: "string", maxLength: 1000 },
    priority: { type: "string", maxLength: 1000 },
    scope: { type: "string", maxLength: 1000 },
    isCompleted: { type: "boolean" },
    isImportant: { type: "boolean" },
  },
  required: ["title", "uid"],
  additionalProperties: true,
};

export const patchTodoValidationSchema = {
  ...postTodoValidationSchema,
  required: [],
};
