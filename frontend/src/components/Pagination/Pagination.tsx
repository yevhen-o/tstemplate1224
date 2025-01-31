import React from "react";

import Button from "src/components/Buttons";
import { ChevronLeft, ChevronRight } from "src/components/Icons";
import { PREDEFINED_PAGE_SIZES } from "src/constants";
import { NativeSelect } from "../Forms/NativeSelect";
import "./Pagination.scss";

interface PaginationProps {
  totalItems: number;
  page: number;
  perPage: number;
  onChange: ({ page, perPage }: { page: number; perPage: number }) => void;
}

export const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  onChange,
  page,
  perPage,
}) => {
  const totalPages = Math.ceil(totalItems / +perPage);

  const getPaginationRange = (currentPage: number, totalPages: number) => {
    const delta = 3;
    const range: (number | "...")[] = [];
    const left = Math.max(2, currentPage - delta);
    const right = Math.min(totalPages - 1, currentPage + delta);

    if (left > 2) {
      range.push(1, "...");
    } else {
      range.push(1);
    }
    for (let i = left; i <= right; i++) {
      range.push(i);
    }

    if (right < totalPages - 1) {
      range.push("...", totalPages);
    } else {
      if (totalPages > 1) {
        range.push(totalPages);
      }
    }

    return range;
  };

  const paginationItems = getPaginationRange(page, totalPages);

  const handleChangePage = (page: number) => () => {
    onChange({ page, perPage });
  };

  const handleChangePerPage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({ page: 1, perPage: +e.target.value });
  };

  return (
    <div className="items-center space-y-2 text-xs sm:space-y-0 sm:space-x-3 grid grid-cols-2 px-8 pagination">
      <div className="items-center space-y-2 text-xs sm:space-y-0 sm:space-x-3 inline-flex ">
        <nav
          aria-label="Pagination"
          className="inline-flex -space-x-px rounded-md shadow-sm dark:bg-gray-100 dark:text-gray-800 "
        >
          <Button
            type="button"
            isBordered
            onClick={handleChangePage(page - 1)}
            disabled={page === 1}
          >
            <span className="sr-only">Previous</span>
            <ChevronLeft size={20} />
          </Button>

          {paginationItems.map((pageItem, index) =>
            pageItem === "..." ? (
              <span key={pageItem + index} className="px-2">
                ...
              </span>
            ) : (
              <Button
                key={pageItem + index}
                onClick={handleChangePage(pageItem)}
                isBordered
                isPrimary={pageItem === page}
                disabled={pageItem === page}
                className={`page__${pageItem}`}
              >
                {pageItem}
              </Button>
            )
          )}

          <Button
            type="button"
            onClick={handleChangePage(page + 1)}
            disabled={page === totalPages}
            isBordered
          >
            <span className="sr-only">Next</span>
            <ChevronRight size={20} />
          </Button>
        </nav>
        <span className="block">
          Page {page} of{" "}
          <span data-testid="total-pages">{totalPages || 1}</span>
          &nbsp;&nbsp;&nbsp;Total items:{" "}
          <span data-testid="total-items">{totalItems}</span>
        </span>
      </div>
      <div className="flex justify-self-end items-center gap-2">
        <span className="block">Items per page:</span>
        <NativeSelect
          name="itemsPerPage"
          className={"my-0"}
          value={perPage.toString()}
          options={PREDEFINED_PAGE_SIZES.map((size) => ({
            value: `${size}`,
            label: `${size}`,
          }))}
          onChange={handleChangePerPage}
        />
      </div>
    </div>
  );
};
