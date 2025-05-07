import { useEffect, useState } from "react";
const Table = (props) => {
  const { result, onEdit, onRemove } = props;
  const [data, setData] = useState([]);
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">{index + 1}</td>
        <td>{item.name}</td>
        <td>
          <div className="d-flex justify-content-center"> 
            <button className="btn btn-phoenix-warning btn-icon fs-7 px-0 me-2" onClick={() => onEdit(item)}><i className="far fa-edit"></i></button>
            <button className="btn btn-phoenix-secondary btn-icon fs-7 text-danger-dark px-0" onClick={() => onRemove(item)}><i className="far fa-trash-alt"></i></button>
          </div>
        </td>
      </tr>
    ))
  }
  useEffect(() => {
    if(result) {
      setData(result.data);
    }
    return () => { setData([]) }
  },[result])

  return (
    <>
      <div id="tableExample" data-list='{"valueNames":["name","email","age"]}'>
        <div className="table-responsive mx-n1 px-1">
          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
              <tr>
                <th style={{ width: 30 }}>#</th>
                <th>เงื่อนไข NPL</th>
                <th style={{ width: 200 }}></th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle" id="bulk-select-body">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={3}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default Table;