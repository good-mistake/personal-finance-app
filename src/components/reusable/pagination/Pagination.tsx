import React, { useEffect } from "react";
import "./pagination.scss";
import Buttons from "../button/Buttons.tsx";
import useMediaQuery from "../../../utils/useMediaQuery.tsx";
interface PaginationProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}) => {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const pageNumbers: (number | string)[] = [];
  const isMobile = useMediaQuery("mobile");
  const isMobileSm = useMediaQuery("mobilesm");

  const handlePreviousPage = () => {
    if (currentPage > 1) onPageChange(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) onPageChange(currentPage + 1);
  };

  const handlePageClick = (page: number) => {
    onPageChange(page);
  };
  if (isMobile) {
    pageNumbers.push(1);

    if (currentPage > 2) {
      pageNumbers.push("...");
    }

    if (currentPage > 1 && currentPage < totalPages) {
      pageNumbers.push(currentPage);
    } else if (currentPage === 1 && totalPages > 1) {
      pageNumbers.push(2);
    }

    if (currentPage < totalPages - 1) {
      pageNumbers.push("...");
    }

    if (totalPages > 1) {
      pageNumbers.push(totalPages);
    }
  } else {
    const maxPageNumbers = 5;
    if (totalPages <= maxPageNumbers) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        pageNumbers.push(1, 2, 3, 4, "...", totalPages);
      } else if (currentPage > totalPages - 3) {
        pageNumbers.push(
          1,
          "...",
          totalPages - 3,
          totalPages - 2,
          totalPages - 1,
          totalPages
        );
      } else {
        pageNumbers.push(
          1,
          "...",
          currentPage - 1,
          currentPage,
          currentPage + 1,
          "...",
          totalPages
        );
      }
    }
  }
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [currentPage]);
  return (
    <div className="pagination">
      <div className="prev">
        <Buttons
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          variant="tertiary"
        >
          <span> Prev</span>
        </Buttons>
      </div>
      <div className="pages">
        {pageNumbers.map((page, index) =>
          typeof page === "number" ? (
            <Buttons
              key={page}
              onClick={() => handlePageClick(page)}
              variant="tertiary"
              disabled={false}
              className={`${currentPage === page ? "active" : ""}  ${
                isMobileSm && "sm"
              }`}
            >
              {page}
            </Buttons>
          ) : (
            <button
              className={`btn btn--tertiary btn--small   ${
                isMobileSm && "sm"
              } `}
            >
              <span key={index} className="ellipsis">
                ...
              </span>
            </button>
          )
        )}
      </div>
      <div className="next">
        <Buttons
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          variant="tertiary"
        >
          <span> Next</span>
        </Buttons>
      </div>
    </div>
  );
};

export default Pagination;
