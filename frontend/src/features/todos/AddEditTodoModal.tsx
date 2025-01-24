import React, { useEffect } from "react";
import { TodoInterface } from "src/Types";
import { createSelector } from "reselect";

import { FieldType, useForm, useTypedSelector, useActions } from "src/hooks";
import Button from "src/components/Buttons";
import Modal from "src/components/Modal";

type AddTodoProps = {
  onClose: () => void;
  propsState?: TodoInterface;
};

const AddTodo: React.FC<AddTodoProps> = ({ onClose, propsState }) => {
  type ValuesType = Omit<TodoInterface, "uid">;
  const initialValue: ValuesType = propsState
    ? ({ ...propsState, uid: undefined } as ValuesType)
    : {
        title: "",
        deadline: "",
        priority: "medium",
        scope: "forWork",
        isImportant: false,
        isCompleted: false,
      };

  const { todoPostItem, todoPatchItem } = useActions();
  const { isFetching, isFetched, hasError } = useTypedSelector((state) =>
    createSelector([(s) => s.todo, (_, key) => key], (todo, key) => todo[key])(
      state,
      propsState ? "patchItem" : "postItem"
    )
  );

  useEffect(() => {
    if (isFetched && !hasError) {
      onClose();
    }
  }, [isFetched, hasError, onClose]);

  const RULES = {
    title: {
      isRequired: true,
      minLength: 15,
      customRules: [
        (value: string) => {
          if (
            value === "some interesting string, maybe check for vulgar words"
          ) {
            return {
              isValid: false,
              errorMessage: "This string is forbidden",
            };
          } else {
            return {
              isValid: true,
              errorMessage: null,
            };
          }
        },
      ],
    },
    deadline: {
      isRequired: true,
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

  const {
    fields,
    values,
    resetForm,
    isFormValid,
    hasFormChanges,
    renderFormField,
    setFieldsTouched,
  } = useForm(RULES, initialValue, formFields);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isFormValid()) {
      if (propsState) {
        await todoPatchItem({
          uid: propsState.uid,
          item: values,
        });
      } else {
        await todoPostItem({
          item: {
            uid: Math.random().toString(36).slice(2, 16),
            ...values,
          },
        });
      }
    } else {
      setFieldsTouched();
    }
  };

  return (
    <Modal title="Add new todo" onClose={onClose}>
      <form onSubmit={handleSubmit} style={{ padding: "20px" }}>
        <h2 className="text-base/7 font-semibold text-gray-900">
          {propsState ? "Edit todo" : "Add new todo"}
        </h2>
        <p className="mt-1 text-sm/6 text-gray-600">
          Use some descriptive title and set a deadline for the task
        </p>
        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
          {fields.map((field) => renderFormField(field))}
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          {isFetching && <span>Loading...</span>}
          {hasError && (
            <span className="text-red-500">Something goes wrong</span>
          )}
          {hasFormChanges() && <Button onClick={resetForm}>Reset</Button>}
          <Button isPrimary type="submit">
            {propsState ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTodo;
