import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
import { stringToDateTh, toCurrency } from "@utils";
const SearchTable = (props) => {
  const { result, filter, getData, handleShowDetail } = props;
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(null);
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">{index + 1}</td>
        <td>{item.k_idcard}</td>
        <td>{item.k_name_prefix}</td>
        <td>{(item.k_firstname ?? '') + ' ' + (item.k_lastname ?? '')}</td>
        <td>{item.loan_province}</td>
        <td>{item.organization_name}</td>
        <td>{item.organization_code}</td>
        <td>{item.policyNO}</td>
        <td>{item.pDate ? stringToDateTh(item.pDate, false) : '-'}</td>
        <td>{toCurrency(item.loan_amount,2)}</td>
        <td>{toCurrency(item.prevNotPayAmount,2)}</td>
        <td>{item.debt_status}</td>
        <td>{item.debt_status_type}</td>
        <td className="align-middle white-space-nowrap text-center pe-0">
          <div className="btn-reveal-trigger position-static">
            <button className="btn btn-phoenix-secondary btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs-10" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span className="fas fa-ellipsis-h fs-10"></span></button>
            <div className="dropdown-menu dropdown-menu-end py-2">
              {item.debt_status == 'สงสัยจะสูญ' ? (
                <button className="dropdown-item" type="button" onClick={() => handleShowDetail(item, true)}>รายละเอียดสถานะหนี้ สงสัยจะสูญ</button>
              ) : (
                <button className="dropdown-item" type="button" onClick={() => handleShowDetail(item, false)}>เปลี่ยนสถานะหนี้ สงสัยจะสูญ</button>
              )}
            </div>
          </div>
        </td>
      </tr>
    ))
  }
  useEffect(() => {
    if(result) {
      setData(result.data);
      setPaging({ currentPage: result.currentPage, total: result.total, totalPage: result.totalPage });
    }
    return () => { setData([]) }
  },[result])

  return (
    <>
      <div data-list='{"valueNames":["name","email","age"]}'>
        <div className="table-responsive mx-n1 px-1">
          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
              <tr>
                <th className="white-space-nowrap fs-9 align-middle ps-0" rowSpan="2" style={{ minWidth: 30 }}>#</th>
                <th colSpan="4">เกษตรกร</th>
                <th colSpan="2">องค์กร</th>
                <th colSpan="6">นิติกรรมสัญญา</th>
                <th rowSpan="2">ดำเนินการ</th>
              </tr>
              <tr>
                <th>เลขบัตรประชาชน</th>
                <th>คำนำหน้า</th>
                <th>ชื่อ-นามสกุล</th>
                <th>จังหวัด</th>
                <th>ชื่อองค์กรการเกษตร</th>
                <th>หมายเลของค์กร</th>
                <th>เลขที่นิติกรรมสัญญา</th>
                <th>วันที่ครบกำหนดชำระ</th>
                <th>ต้นเงินตามแผน</th>
                <th>ยอดเงินที่ค้างชำระ</th>
                <th>สถานะหนี้</th>
                <th>ประเภทสถานะบัญชีลูกหนี้</th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle" id="bulk-select-body">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={20}>
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
export default SearchTable;