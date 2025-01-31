import { useEffect, useRef } from "react";
import { FieldType, useObserveElementSize } from "src/hooks";
import Button from "../Buttons";
import { InputField } from "../Forms/InputField";
import { NativeSelect } from "../Forms/NativeSelect";
import { deepEqual } from "src/helpers/utils";
import { FilterValueType } from "src/Types";

interface FilterProps {
  filterFields: FieldType[];
  initialValues: FilterValueType;
  appliedValues: FilterValueType;
  onChange: (values: FilterValueType) => void;
  resetForm: () => void;
}

const Filters: React.FC<FilterProps> = ({
  onChange,
  resetForm,
  filterFields,
  initialValues = {},
  appliedValues,
}) => {
  const el = useRef(null);

  const { wrapperHeight } = useObserveElementSize(el);

  const updateValues =
    (field: string) =>
    (e: React.FormEvent<HTMLSelectElement | HTMLInputElement>) => {
      const target = e.target as HTMLInputElement | HTMLSelectElement;
      onChange({ [field]: target.value });
    };

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--filters-height",
      `${wrapperHeight}px`
    );
  }, [wrapperHeight]);

  return (
    <div
      ref={el}
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "24px",
        padding: "0 32px",
      }}
    >
      {filterFields.map((field) => {
        if (field.fieldType === "input") {
          return (
            <InputField
              key={field.name}
              name={field.name}
              type="text"
              placeholder={field.label}
              value={appliedValues[field.name] || ""}
              onChange={updateValues(field.name)}
            />
          );
        }
        if (field.fieldType === "select") {
          return (
            <NativeSelect
              key={field.name}
              name={field.name}
              type="text"
              placeholder={field.label}
              value={appliedValues[field.name] || ""}
              onChange={updateValues(field.name)}
              options={field.options}
            />
          );
        }
      })}
      {!deepEqual(initialValues, appliedValues) &&
        appliedValues &&
        Object.values(appliedValues).some((v) => !!v) && (
          <Button isPrimary onClick={resetForm}>
            Clear
          </Button>
        )}
    </div>
  );
};

export default Filters;
