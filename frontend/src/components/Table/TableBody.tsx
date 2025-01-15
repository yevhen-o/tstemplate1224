import { nanoid } from "nanoid";
import classNames from "classnames";
import React, { PropsWithChildren, ReactElement } from "react";

import { TableField } from "./TableHead";

type TableBodyProps<O> = {
  name: string;
  data: O[];
  configuredFields: TableField[];
  getRowClasses?: (record: O) => string;
  renderFunctions?: Record<string, React.FC<O>>;
};

const TableBody = <O extends Record<string, unknown>>({
  data,
  name,
  getRowClasses,
  renderFunctions = {},
  configuredFields,
}: PropsWithChildren<TableBodyProps<O>>): ReactElement => {
  return (
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
  );
};

export default TableBody;
