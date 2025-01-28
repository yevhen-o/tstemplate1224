import React, { useState } from "react";
import { SubmitHandler, useFormContext } from "react-hook-form";
import { ResponseThunkAction, TodoInterface } from "src/Types";
import { createSelector } from "reselect";

import { useTypedSelector, useActions } from "src/hooks";
import Button from "src/components/Buttons";
import Modal from "src/components/Modal";
import { TodoSchemaType } from "./types/todoSchema";
import { ControlledInputField } from "src/components/Forms/InputField/ControlledInputField";
import { ControlledCheckBox } from "src/components/Forms/CheckBox";
import { ControlledRadioInput } from "src/components/Forms/RadioInput";
import { ControlledNativeSelect } from "src/components/Forms/NativeSelect";
import { ControlledDatePicker } from "src/components/Forms/DatePicker";

type AddTodoProps = {
  onClose: () => void;
  propsState?: TodoInterface;
};

const AddTodo: React.FC<AddTodoProps> = ({ onClose, propsState }) => {
  const { todoPostItem, todoPatchItem } = useActions();

  const { isFetching, hasError } = useTypedSelector((state) =>
    createSelector([(s) => s.todo, (_, key) => key], (todo, key) => todo[key])(
      state,
      propsState ? "patchItem" : "postItem"
    )
  );

  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof TodoSchemaType, boolean>>
  >({});

  const {
    reset,
    handleSubmit,
    formState: { isSubmitting, isDirty },
  } = useFormContext<TodoSchemaType>();

  const submitFunction: SubmitHandler<TodoSchemaType> = async (data) => {
    let result: ResponseThunkAction;
    if (propsState) {
      result = (await todoPatchItem({
        uid: propsState.uid,
        item: { ...data, deadline: data.deadline.toDateString() },
      })) as unknown as ResponseThunkAction;
    } else {
      result = (await todoPostItem({
        item: {
          uid: Math.random().toString(36).slice(2, 16),
          ...data,
          deadline: data.deadline.toDateString(),
        },
      })) as unknown as ResponseThunkAction;
    }
    if (!result.error) {
      onClose();
    }
  };

  const handleBlur = (field: keyof TodoSchemaType) => () =>
    setTouchedFields((prev) => ({ ...prev, [field]: true }));

  return (
    <Modal title="Add new todo" onClose={onClose}>
      <form onSubmit={handleSubmit(submitFunction)} style={{ padding: "20px" }}>
        <h2 className="text-base/7 font-semibold text-gray-900">
          {propsState ? "Edit todo" : "Add new todo"}
        </h2>
        <p className="mt-1 text-sm/6 text-gray-600">
          Use some descriptive title and set a deadline for the task
        </p>
        <div className="mt-10 flex-col gap-8">
          <ControlledInputField<TodoSchemaType>
            name="title"
            label="Title"
            handleBlur={handleBlur("title")}
            isTouched={!!touchedFields["title"]}
          />
          <ControlledDatePicker<TodoSchemaType>
            name="deadline"
            label="Deadline"
            handleBlur={handleBlur("deadline")}
            isTouched={!!touchedFields["deadline"]}
          />
          <ControlledCheckBox<TodoSchemaType>
            id="importantUid"
            name="isImportant"
            label="Important"
            handleBlur={handleBlur("isImportant")}
            isTouched={!!touchedFields["isImportant"]}
          />

          <ControlledRadioInput<TodoSchemaType>
            name="scope"
            value="forFun"
            id="importantUid1"
            label="Done this for fun"
            handleBlur={handleBlur("scope")}
            isTouched={!!touchedFields["scope"]}
          />

          <ControlledNativeSelect<TodoSchemaType>
            name="priority"
            label="Priority"
            handleBlur={handleBlur("priority")}
            isTouched={!!touchedFields["priority"]}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
            ]}
          />

          <ControlledRadioInput<TodoSchemaType>
            name="scope"
            value="forWork"
            id="importantUid2"
            label="Done this for work or study"
            handleBlur={handleBlur("scope")}
            isTouched={!!touchedFields["scope"]}
          />
        </div>
        <div className="mt-6 flex items-center justify-end gap-x-6">
          {isFetching && <span>Loading...</span>}
          {hasError && (
            <span className="text-red-500">Something goes wrong</span>
          )}
          {isDirty && <Button onClick={() => reset()}>Reset</Button>}
          <Button
            disabled={isSubmitting}
            isPrimary
            type="submit"
            onClick={() =>
              setTouchedFields({
                title: true,
                deadline: true,
                isImportant: true,
                scope: true,
                priority: true,
              })
            }
          >
            {propsState ? "Update" : "Submit"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default AddTodo;
