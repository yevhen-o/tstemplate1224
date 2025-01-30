import React from "react";
import { createSelector } from "reselect";

import { TodoInterface } from "src/Types";
import Button from "src/components/Buttons";
import { useTypedSelector } from "src/hooks";
import { TodoSchemaType } from "./types/todoSchema";
import { useCustomFormContext } from "src/hooks/useCustomFormContext";

import { ControlledInputField } from "src/components/Forms/InputField";
import { ControlledCheckBox } from "src/components/Forms/CheckBox";
import { ControlledRadioInput } from "src/components/Forms/RadioInput";
import { ControlledNativeSelect } from "src/components/Forms/NativeSelect";
import { ControlledDatePicker } from "src/components/Forms/DatePicker";

type AddEditTodoFormProps = {
  propsState?: TodoInterface;
};

export const AddEditTodoForm: React.FC<AddEditTodoFormProps> = ({
  propsState,
}) => {
  const { isFetching, hasError } = useTypedSelector((state) =>
    createSelector([(s) => s.todo, (_, key) => key], (todo, key) => todo[key])(
      state,
      propsState ? "patchItem" : "postItem"
    )
  );

  const {
    reset,
    setAllFieldsTouched,
    formState: { isSubmitting, isDirty },
  } = useCustomFormContext<TodoSchemaType>();
  return (
    <>
      <h2 className="text-base/7 font-semibold text-gray-900">
        {propsState ? "Edit todo" : "Add new todo"}
      </h2>
      <p className="mt-1 text-sm/6 text-gray-600">
        Use some descriptive title and set a deadline for the task
      </p>
      <div className="mt-10 flex-col gap-8">
        <ControlledInputField<TodoSchemaType> name="title" label="Title" />
        <ControlledDatePicker<TodoSchemaType>
          name="deadline"
          label="Deadline"
        />
        <ControlledCheckBox<TodoSchemaType>
          id="importantUid"
          name="isImportant"
          label="Important"
        />

        <ControlledRadioInput<TodoSchemaType>
          name="scope"
          value="forFun"
          id="importantUid1"
          label="Done this for fun"
        />

        <ControlledNativeSelect<TodoSchemaType>
          name="priority"
          label="Priority"
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
        />
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        {isFetching && <span>Loading...</span>}
        {hasError && <span className="text-red-500">Something goes wrong</span>}
        {isDirty && <Button onClick={() => reset()}>Reset</Button>}
        <Button
          isPrimary
          type="submit"
          disabled={isSubmitting}
          onClick={setAllFieldsTouched}
        >
          {propsState ? "Update" : "Submit"}
        </Button>
      </div>
    </>
  );
};
