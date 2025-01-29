import { z } from "zod";

export const todoSchema = z
  .object({
    title: z.string().min(15).max(250),
    deadline: z.date(),
    scope: z.enum(["forWork", "forFun"]),
    priority: z.enum(["low", "medium", "high"]),
    isImportant: z.boolean().optional(),
    isCompleted: z.boolean(),
  })
  .refine(
    (data) =>
      data.title !== "some interesting string, maybe check for vulgar words",
    {
      message: "This string is forbidden",
      path: ["title"],
    }
  );

export type TodoSchemaType = z.infer<typeof todoSchema>;

export const defaultValues: TodoSchemaType = {
  title: "",
  deadline: new Date(),
  priority: "medium",
  scope: "forWork",
  isImportant: false,
  isCompleted: false,
};
