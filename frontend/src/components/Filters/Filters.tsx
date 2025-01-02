import { useEffect } from "react";
import { FormValueType, FieldType, useForm } from "src/hooks";
import { withWrapperSize } from "src/hocs/withWrapperSize";
import Button from "../Buttons";

interface FilterProps {
  filterFields: FieldType[];
  initialValues: FormValueType;
  onChange: (values: FormValueType) => void;
  wrapperWidth: number;
  wrapperHeight: number;
}

const Filters: React.FC<FilterProps> = ({
  onChange,
  filterFields,
  initialValues = {},
  wrapperHeight,
  wrapperWidth,
}) => {
  const { values, renderFormField, hasFormChanges, resetForm } = useForm(
    {},
    initialValues
  );

  useEffect(() => {
    onChange(values);
  }, [values, onChange]);

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
