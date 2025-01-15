import { nanoid } from "nanoid";
import classNames from "classnames";
import React, { PropsWithChildren, ReactElement, useState } from "react";
import { Settings, ArrowDown, ArrowUp } from "src/components/Icons";
import "./Table.scss";

import MultipleChoiceDropDown from "../MultipleChoiceDropDown/MultipleChoiceDropDown";

interface TableField {
  title?: string;
  field: string;
  isSortable?: boolean;
  isAlwaysVisible?: boolean;
}

type TableProps<O> = {
  name: string;
  headerFields: TableField[];
  wrapperClassName?: string;
  topWidget?: ReactElement;
  data: O[];
  sortBy?: string;
  isSortedAsc?: boolean;
  isDataFetching?: boolean;
  showEmptyDataMessage?: boolean;
  emptyDataMessageText?: string;
  getRowClasses?: (record: O) => string;
  onSortChange?: (sortBy: string, isSortedAsc: boolean) => void;
  renderFunctions?: Record<string, React.FC<O>>;
};

const Table = <O extends Record<string, unknown>>({
  headerFields,
  topWidget,
  wrapperClassName,
  data,
  name,
  sortBy,
  isSortedAsc,
  showEmptyDataMessage,
  emptyDataMessageText,
  isDataFetching,
  getRowClasses,
  onSortChange,
  renderFunctions = {},
}: PropsWithChildren<TableProps<O>>): ReactElement => {
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

  const [fieldsToDisplay, setFieldsToDisplay] = useState<string[]>(
    headerFields.map((f) => f.field)
  );
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

  const configuredFields = headerFields.filter((f) =>
    fieldsToDisplay.includes(f.field)
  );

  return (
    <div
      className={classNames(wrapperClassName, "wrapper", `${name}__wrapper`)}
    >
      {topWidget && topWidget}
      <table className={classNames("table", `${name}__table`)}>
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
        <tbody>
          {data.map((record, index) => (
            <tr
              key={`${record?.id || nanoid()}__${index}`}
              className={classNames(
                "row",
                `${name}__row`,
                getRowClasses ? getRowClasses(record) : ""
              )}
            >
              {configuredFields.map((f) => (
                <td
                  key={`${index}__${f.field}`}
                  className={classNames(
                    "caption",
                    "cell",
                    `${name}__cell`,
                    `${name}__cell--${f.field}`
                  )}
                >
                  {renderFunctions[f.field]
                    ? renderFunctions[f.field](record)
                    : ((record?.[f.field] as string) || "").toString()}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {!!isDataFetching && (
        <div className={"table__cell-shimmer"}>Loading...</div>
      )}
      {!!showEmptyDataMessage && (
        <>{emptyDataMessageText ? emptyDataMessageText : "No data found."}</>
      )}
    </div>
  );
};

export default Table;
