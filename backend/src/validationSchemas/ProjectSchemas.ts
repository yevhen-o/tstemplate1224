export const postProjectValidationSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string", maxLength: 10000 },
    imageUrl: { type: "string" },
  },
  required: ["name"],
  additionalProperties: true,
};

export const patchProjectValidationSchema = {
  ...postProjectValidationSchema,
  required: [],
};
