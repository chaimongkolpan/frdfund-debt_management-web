import { useEffect, useCallback, useState } from "react";
import { ChevronLeft, ChevronRight } from "react-feather";
import ReactPaginate from 'react-paginate';

const Paging = (props) => {
  const { currentPage, total, totalPage, setPage, pageSize = 10 } = props;
  return (
    <div className="d-flex justify-content-between mt-3">
      <span className={`d-sm-inline-block`}>
      {`${(currentPage - 1) * pageSize + 1} 
      ถึง ${total > (currentPage * pageSize) ? (currentPage * pageSize) : total} 
      จาก ${total}`}
      </span>
      <ReactPaginate
        breakLabel="..."
        nextLabel={<ChevronRight size={14} color="#344054" />}
        onPageChange={(page) => setPage(page.selected + 1)}
        pageRangeDisplayed={2}
        pageCount={totalPage}
        previousLabel={<ChevronLeft size={14} color="#344054" />}
        renderOnZeroPageCount={null}
        forcePage={currentPage-1}
        
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        marginPagesDisplayed={2}
        containerClassName="pagination"
        activeClassName="active"
      />
    </div>
  );
};
export default Paging;
