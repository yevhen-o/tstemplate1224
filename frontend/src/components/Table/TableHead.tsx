import classNames from "classnames";
import { Settings, ArrowDown, ArrowUp } from "src/components/Icons";

import MultipleChoiceDropDown from "../MultipleChoiceDropDown/MultipleChoiceDropDown";

export interface TableField {
  field: string;
  title?: string;
  isSortable?: boolean;
  isAlwaysVisible?: boolean;
}

type TableHeadProps = {
  name: string;
  fieldsToDisplay: string[];
  headerFields: TableField[];
  setFieldsToDisplay: React.Dispatch<React.SetStateAction<string[]>>;
  configuredFields: TableField[];
  sortBy?: string;
  isSortedAsc?: boolean;
  onSortChange?: (sortBy: string, isSortedAsc: boolean) => void;
};

const TableHead: React.FC<TableHeadProps> = ({
  name,
  sortBy,
  isSortedAsc,
  headerFields,
  onSortChange,
  fieldsToDisplay,
  configuredFields,
  setFieldsToDisplay,
}) => {
  const hasConfiguration = headerFields.some((f) => !f.isAlwaysVisible);

  const handleToggleField = (field: string) => () => {
    setFieldsToDisplay((prev: string[]) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  const configurationOptions = headerFields.map((f) => ({
    label: f.title || f.field,
    value: f.field,
    onClick: handleToggleField(f.field),
    disabled: f.isAlwaysVisible,
  }));

  const handleSort = (field: TableField) => () => {
    if (!field.isSortable) {
      return;
    }
    if (field.field === sortBy) {
      onSortChange?.(sortBy, !isSortedAsc);
    } else {
      onSortChange?.(field.field, true);
    }
  };
  return (
    <thead>
      <tr className={classNames("row", "row--head", `${name}__row--head`)}>
        {configuredFields.map((f, index) => (
          <th
            key={f.field}
            className={classNames(
              "caption",
              "cell",
              "cell--head",
              `${name}__cell--head`,
              `${name}__cell--${f.field}`,
              { "cell--sortable": f.isSortable }
            )}
            onClick={handleSort(f)}
            aria-label={`Change sort field to ${f.title}`}
            role="button"
          >
            {f.title}
            {f.isSortable && (
              <span
                className={classNames("cell__sort-indicator", {
                  "cell__sort-indicator--active": sortBy === f.field,
                })}
              >
                {isSortedAsc || sortBy !== f.field ? (
                  <ArrowDown size={20} />
                ) : (
                  <ArrowUp size={20} />
                )}
              </span>
            )}
            {hasConfiguration && configuredFields.length - 1 === index && (
              <MultipleChoiceDropDown
                value={fieldsToDisplay}
                menuItems={configurationOptions}
              >
                <Settings size="20" />
              </MultipleChoiceDropDown>
            )}
          </th>
        ))}
      </tr>
    </thead>
  );
};

export default TableHead;
