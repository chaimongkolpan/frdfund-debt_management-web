import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
const UserTable = (props) => {
  const { result, getData, filter, onEdit, onRemove } = props;
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(null);
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">{index + 1}</td>
        <td>{item.username}</td>
        <td>{item.role_detail}</td>
        <td>{(item.firstname ?? '') + ' ' + (item.lastname ?? '')}</td>
        <td>{item.position}</td>
        <td>{item.province}</td>
        <td>{`${item.region_no ?? ''} (${item.region ?? '-'})`}</td>
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
      setPaging({ currentPage: result.currentPage, total: result.total, totalPage: result.totalPage })
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
                <th style={{ minWidth: 30 }}>#</th>
                <th>ชื่อผู้ใช้งาน</th>
                <th>สิทธิ์การเข้าใช้งาน</th>
                <th>ชื่อ-นามสกุล</th>
                <th>ตำแหน่ง</th>
                <th>จังหวัด</th>
                <th>ภูมิภาค</th>
                <th></th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle" id="bulk-select-body">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={8}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {paging?.total > 0 && (
          <Paging currentPage={paging?.currentPage ?? 0} total={paging?.total ?? 1} totalPage={paging?.totalPage ?? 1} 
            setPage={(page) => getData({ ...filter, currentPage: page })} 
          />
        )}
      </div>
    </>
  );
};
export default UserTable;