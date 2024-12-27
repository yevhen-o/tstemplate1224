export type TodoInterface = {
  uid: string;
  title: string;
  deadline: string;
  isCompleted: boolean;
  priority: string;
  isImportant?: boolean;
  scope: string;
};
