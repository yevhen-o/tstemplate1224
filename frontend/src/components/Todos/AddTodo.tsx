import React from "react";
import { TodoInterface } from "src/Types";
import { useActions } from "src/hooks/useActions";
import useForm, { FieldType } from "src/hooks/useForm";
import Button from "../Buttons";

const AddTodo: React.FC = () => {
  type ValuesType = Omit<TodoInterface, "uid" | "isCompleted">;
  const initialValue: ValuesType = {
    title: "",
    deadline: "",
    priority: "medium",
    scope: "forWork",
    isImportant: false,
  };

  const { todoAdded } = useActions();

  const RULES = {
    title: {
      isRequired: true,
      minLength: 15,
    },
    deadline: {
      isRequired: true,
    },
    isImportant: {
      isChecked: true,
    },
  };

  const formFields: FieldType[] = [
    { fieldType: "input", name: "title", label: "Title" },
    { fieldType: "date", name: "deadline", label: "Due date" },
    {
      fieldType: "select",
      name: "priority",
      label: "Priority",
      options: [
        { value: "low", label: "Low" },
        { value: "medium", label: "Medium" },
        { value: "high", label: "High" },
      ],
    },
    {
      fieldType: "radio",
      name: "scope",
      id: "customRadio1",
      value: "forFun",
      label: "Done it for fun",
      helpText: "This is a custom radio",
    },
    {
      fieldType: "radio",
      name: "scope",
      id: "customRadio2",
      value: "forWork",
      label: "Done it for personal growth",
      helpText:
        "Maybe need to think about radio group, but it's not a priority",
    },
    {
      fieldType: "checkbox",
      name: "isImportant",
      label: "Important",
      helpText: "Mark as important",
    },
  ];

  const { values, resetForm, isFormValid, hasFormChanges, renderFormField } =
    useForm(RULES, initialValue);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    todoAdded({
      uid: Math.random().toString(36).slice(2, 5),
      isCompleted: false,
      ...values,
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
        <h2 className="text-base/7 font-semibold text-gray-900">
          Add new todo
        </h2>
        <p className="mt-1 text-sm/6 text-gray-600">
          Use some descriptive title and set a deadline for the task
        </p>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {formFields.map((field) => renderFormField(field))}
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          {hasFormChanges() && <Button onClick={resetForm}>Reset</Button>}
          <Button isPrimary disabled={!isFormValid()} type="submit">
            Submit
          </Button>
        </div>
      </form>
    </>
  );
};

export default AddTodo;
