export const postOrgValidationSchema = {
  type: "object",
  properties: {
    name: { type: "string" },
    domain: { type: "string" },
  },
  required: ["name", "domain"],
  additionalProperties: true,
};

export const patchOrgValidationSchema = {
  ...postOrgValidationSchema,
  required: [],
};
