import { useEffect, useState } from "react";
import { Button } from "reactstrap";
import Paging from "@views/components/Paging";
const ClassifyDataTable = (props) => {
  const { result, view, filter, getData } = props;
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(null);
  const OnView = (item) => {
    view(item)
  }
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="align-middle">{((paging?.currentPage - 1) * 10) + index + 1}</td>
        <td className="align-middle">{item.idCard}</td>
        <td className="align-middle">{item.namePrefix}</td>
        <td className="align-middle">{(item.fullName ?? '')}</td>
        <td className="align-middle">{item.province}</td>
        <td className="align-middle">{item.creditorType}</td>
        <td className="align-middle">{item.creditorName}</td>
        <td className="align-middle">{item.creditorProvince}</td>
        <td className="align-middle">{item.creditorBranch}</td>
        <td className="align-middle">{item.countContract}</td>
        <td className="align-middle">
          <div className="d-flex justify-content-center"> 
            <Button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" onClick={() => OnView(item)}><i className="far fa-list-alt "></i></Button>
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
      <div id="tableExample" data-list='{"valueNames":["id","name","province"]}'>
        <div className="table-responsive mx-n1 px-1">
          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
              <tr>
                <th rowSpan="2" style={{ minWidth: 30 }}>#</th>
                <th colSpan="4">เกษตรกร</th>
                <th colSpan="4">เจ้าหนี้</th>
                <th colSpan="2">ทะเบียนหนี้</th>
              </tr>
              <tr>
                <th>เลขบัตรประชาชน</th>
                <th>คำนำหน้า</th>
                <th>ชื่อ-นามสกุล</th>
                <th>จังหวัด</th>
                <th>ประเภทเจ้าหนี้</th>
                <th>สถาบันเจ้าหนี้</th>
                <th>จังหวัดเจ้าหนี้</th>
                <th>สาขาเจ้าหนี้</th>
                <th>จำนวน</th>
                <th>รายละเอียด</th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={26}>
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
export default ClassifyDataTable;