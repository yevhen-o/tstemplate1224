import { useEffect, useRef } from "react";

import { FieldType, useObserveElementSize } from "src/hooks";
import { InputField } from "../Forms/InputField";
import { NativeSelect } from "../Forms/NativeSelect";
import { FilterValueType } from "src/Types";
import Button from "../Buttons";
import "./Filters.scss";

interface FilterProps {
  filterFields: FieldType[];
  appliedValues: FilterValueType;
  onChange: (values: FilterValueType) => void;
  resetForm: () => void;
}

const Filters: React.FC<FilterProps> = ({
  onChange,
  resetForm,
  filterFields,
  appliedValues,
}) => {
  const el = useRef(null);
  const fieldsNames = filterFields.map((field) => field.name);
  const filterValues = fieldsNames.reduce(
    (acc, name) => ({ ...acc, [name]: appliedValues[name] }),
    {}
  );

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
    <div ref={el} className="filters__wrapper">
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

      {filterValues && Object.values(filterValues).some((v) => !!v) && (
        <Button isPrimary onClick={resetForm}>
          Clear
        </Button>
      )}
    </div>
  );
};

export default Filters;
