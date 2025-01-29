export type TodoInterface = {
  uid: string;
  title: string;
  deadline: string;
  isCompleted: boolean;
  priority: "low" | "medium" | "high";
  isImportant?: boolean;
  scope: "forFun" | "forWork";
};
