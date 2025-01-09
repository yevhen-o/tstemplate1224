export const postOrgValidationSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    domain: { type: "string" },
    ownerId: { type: "number" },
  },
  required: ["name", "domain", "ownerId"],
  additionalProperties: true,
};

export const patchOrgValidationSchema = {
  ...postOrgValidationSchema,
  required: [],
};
