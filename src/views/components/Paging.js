import { useEffect, useCallback, useState } from "react";

const Paging = (props) => {
  const { current, total, setPage } = props;
  const RenderPage = (p, current, setPage) => {
    return (<li class={`${p == current ? "active" : ""}`}><button class="page" type="button" onClick={() =>  setPage(p)}>{p}</button></li>)
  }
  const RenderAll = (current, p, total, setPage) => {
    let elem = null;
    
  }
  return (total > 1 && (
    <div className="d-flex justify-content-between mt-3">
      <span className={`d-sm-inline-block`} data-list-info="data-list-info"></span>
      <div className="d-flex">
        <button className="page-link" data-list-pagination="prev"><span className="fas fa-chevron-left"></span></button>
        <ul className="mb-0 pagination">
          
        </ul>
        <button className="page-link pe-0" data-list-pagination="next"><span className="fas fa-chevron-right"></span></button>
      </div>
    </div>
  ));
};
export default Paging;
