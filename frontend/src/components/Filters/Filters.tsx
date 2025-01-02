import { useEffect } from "react";
import { FormValueType, FieldType, useForm } from "src/hooks";
import Button from "../Buttons";

interface FilterProps {
  filterFields: FieldType[];
  initialValues: FormValueType;
  onChange: (values: FormValueType) => void;
}

const Filters: React.FC<FilterProps> = ({
  onChange,
  filterFields,
  initialValues = {},
}) => {
  const { values, renderFormField, hasFormChanges, resetForm } = useForm(
    {},
    initialValues
  );

  useEffect(() => {
    onChange(values);
  }, [values, onChange]);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "24px",
        padding: "0 32px",
      }}
    >
      {filterFields.map((field) => renderFormField(field))}
      {hasFormChanges() && (
        <Button isPrimary onClick={resetForm}>
          Clear
        </Button>
      )}
    </div>
  );
};

export default Filters;
