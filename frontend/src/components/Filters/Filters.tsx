import { useEffect } from "react";
import { FormValueType, FieldType, useForm } from "src/hooks";
import { withWrapperSize } from "src/hocs/withWrapperSize";
import Button from "../Buttons";

interface FilterProps {
  filterFields: FieldType[];
  initialValues: FormValueType;
  appliedValues?: FormValueType;
  onChange: (values: FormValueType) => void;
  wrapperWidth: number;
  wrapperHeight: number;
}

const Filters: React.FC<FilterProps> = ({
  onChange,
  filterFields,
  initialValues = {},
  appliedValues,
  wrapperHeight,
  wrapperWidth,
}) => {
  const { values, renderFormField, hasFormChanges, resetForm, updateValues } =
    useForm({}, initialValues);

  useEffect(() => {
    onChange(values);
  }, [values, onChange]);

  useEffect(() => {
    if (appliedValues) updateValues(appliedValues);
  }, [appliedValues, updateValues]);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--filters-height",
      `${wrapperHeight}px`
    );
  }, [wrapperHeight]);
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
      {`Wrapper width: ${wrapperWidth} && wrapperHeight ${wrapperHeight}`}
    </div>
  );
};

export default withWrapperSize(Filters);
