import {
  Link as MuiLink,
  Pagination as MuiPagination,
  PaginationItem,
} from "@mui/material";

const Pagination = ({
  pageNumber,
  totalCount,
  setCurrentPage,
}: {
  pageNumber: number;
  totalCount: number;
  setCurrentPage: (page: number) => void;
}) => {
  const handleClick = (num: any) => {
    setCurrentPage(num);
  };

  return (
    <div className="w-hull flex justify-center items-center m-5">
      <MuiPagination
        page={pageNumber}
        count={totalCount}
        renderItem={(item) => (
          <button onClick={() => handleClick(item.page)}>
            <PaginationItem
              component={MuiLink}
              {...item}
              className="rounded-none"
            />
          </button>
        )}
      />
    </div>
  );
};

export default Pagination;
