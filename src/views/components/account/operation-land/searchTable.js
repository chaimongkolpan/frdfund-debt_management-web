import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
import { stringToDateTh, toCurrency } from "@utils";
const SearchTable = (props) => {
  const { result, filter, getData, handleShowDetail, handleRequestClose
  } = props;
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(null);
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">{index + 1}</td>
        <td>
          <div className='d-flex justify-content-center'>
            <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => handleShowDetail(item)}>
    <i className="fas fa-plus"></i>
            </button>
           </div>
        </td>
        <td>
          <div className='d-flex justify-content-center'>
            <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => handleRequestClose(item)}>
    <i className="fas fa-list"></i>
            </button>
           </div>
         </td>
        <td>{(item.k_firstname ?? '') + ' ' + (item.k_lastname ?? '')}</td>
        <td>{item.loan_province}</td>
        <td>{item.loan_creditor_type}</td>
        <td>{item.loan_creditor_name}</td>
        <td>{item.loan_creditor_province}</td>
        <td>{item.loan_creditor_branch}</td>
        <td>{item.policyNO}</td>
        <td>{item.loan_debt_type}</td>
        <td>{item.policyStartDate ? stringToDateTh(item.policyStartDate, false) : '-'}</td>
        <td>{item.numberOfPeriodPayback}</td>
        <td>{item.numberOfYearPayback}</td>
        <td>{toCurrency(item.loan_amount)}</td>
        <td>{toCurrency(item.compensation_amount)}</td>
        <td>{item.policyStatus}</td>
        <td>{`${item.assetCount ? item.assetCount : 0} แปลง`}</td>
        <td>{`${item.guarantorCount ? item.guarantorCount : 0} คน`}</td>
        <td>{toCurrency(item.compensation_amount)}</td>
        <td>{item.policyStatus}</td>
        <td>{`${item.assetCount ? item.assetCount : 0} แปลง`}</td>
        <td>{`${item.guarantorCount ? item.guarantorCount : 0} คน`}</td>
        {/* <td className="align-middle white-space-nowrap text-center pe-0">
          <div className="btn-reveal-trigger position-static">
            <button className="btn btn-phoenix-secondary btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs-10" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span className="fas fa-ellipsis-h fs-10"></span></button>
            <div className="dropdown-menu dropdown-menu-end py-2">
              <button className="dropdown-item" type="button" onClick={() => handleShowDetail(item)}>คำนวนยอดปิดสัญญา</button>
              <button className="dropdown-item" type="button" onClick={() => handleRequestClose(item)}>ยื่นคำร้องปิดสัญญา</button>
            </div>
          </div>
        </td> */}
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
                <th rowSpan="2">ดำเนินการ</th>
                <th rowSpan="2">รายละเอียดหลักทรัพย์</th>
                <th colSpan="4">เกษตรกร</th>
                <th colSpan="11">หลักประกัน</th>
                <th colSpan="3">ยืมโฉนด</th>
                <th colSpan="3">คืนโฉนด</th>
              </tr>
              <tr>
                <th>เลขบัตรประชาชน</th>
                <th>คำนำหน้า</th>
                <th>ชื่อ-นามสกุล</th>
                <th>จังหวัด</th>
                <th>เลขที่นิติกรรมสัญญา</th>
                <th>ดัชนีจัดเก็บหลักประกัน</th>
                <th>เจ้าของหลักประกัน</th>
                <th>เลขที่หลักประกัน</th>
                <th>จังหวัด</th>
                <th>อำเภอ</th>
                <th>ตำบล</th>
                <th>ไร่</th>
                <th>งาน</th>
                <th>ตารางวา</th>
                <th>เลขที่หนังสือ</th>
                <th>วันที่หนังสือ</th>
                <th>เหตุผล</th>
                <th>เลขที่หนังสือ</th>
                <th>วันที่หนังสือ</th>
                <th>หมายเหตุ</th>
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