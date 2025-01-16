import { useEffect, useRef } from "react";
import {
  FormValueType,
  FieldType,
  useForm,
  useObserveElementSize,
} from "src/hooks";
import Button from "../Buttons";

interface FilterProps {
  filterFields: FieldType[];
  initialValues: FormValueType;
  appliedValues?: FormValueType;
  onChange: (values: FormValueType) => void;
}

const Filters: React.FC<FilterProps> = ({
  onChange,
  filterFields,
  initialValues = {},
  appliedValues,
}) => {
  const el = useRef(null);
  const { values, renderFormField, hasFormChanges, resetForm, updateValues } =
    useForm({}, initialValues);

  useEffect(() => {
    onChange(values);
  }, [values, onChange]);

  const { wrapperHeight } = useObserveElementSize(el);

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
      ref={el}
      style={{
        display: "flex",
        alignItems: "flex-end",
        gap: "24px",
        padding: "0 32px",
      }}
    >
      {filterFields.map((field) => renderFormField(field))}
      {hasFormChanges() && values && Object.values(values).some((v) => !!v) && (
        <Button isPrimary onClick={resetForm}>
          Clear
        </Button>
      )}
    </div>
  );
};

export default Filters;
