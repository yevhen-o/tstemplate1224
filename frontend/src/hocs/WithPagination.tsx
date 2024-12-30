import React, { useState } from "react";

interface WithPaginationProps<T> {
  items: T[];
}

interface InjectedProps<T> {
  itemsToDisplay: T[];
}

function withPagination<T>(Component: React.ComponentType<InjectedProps<T>>) {
  return function PaginationWrapper(props: WithPaginationProps<T>) {
    const { items } = props;
    const [page, setPage] = useState(1);
    const [perPage, setPerPage] = useState(5);

    const totalPages = Math.ceil(items.length / perPage);

    const handleChangePage = (pageToShow: number) => () => {
      setPage(pageToShow);
    };

    const itemsToDisplay = items.slice(
      (page - 1) * perPage,
      (page - 1) * perPage + perPage
    );

    return (
      <>
        <Component itemsToDisplay={itemsToDisplay} {...props} />
        <div>
          <button onClick={handleChangePage(page - 1)} disabled={page === 1}>
            Previous page
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(
            (pageItem) => (
              <button
                key={pageItem}
                onClick={handleChangePage(pageItem)}
                data-active={pageItem === page}
                disabled={pageItem === page}
              >
                {pageItem}
              </button>
            )
          )}
          <button
            onClick={handleChangePage(page + 1)}
            disabled={page === totalPages}
          >
            Next page
          </button>
          <input
            type="number"
            value={perPage}
            onChange={(e) => {
              const newPerPage = Math.max(+e.target.value, 1); // Ensure positive value
              setPerPage(newPerPage);
              setPage(1);
            }}
          />
        </div>
      </>
    );
  };
}

export default withPagination;
