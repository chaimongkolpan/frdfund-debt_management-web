import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
import { stringToDateTh, toCurrency } from "@utils";
const SearchTable = (props) => {
  const { result, filter, getData, handleShowDetail, handleOperation,handleSurvey,handleLandLease,handleExpropriation
  } = props;
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(null);
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">{((filter?.currentPage - 1) * process.env.VITE_PAGESIZE) + index + 1}</td>
        {/* <td>
          <div className='d-flex justify-content-center'>
            <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => handleOperation(item)}>
            <i className="fas fa-square-plus"></i>
            </button>
           </div>
        </td>
        <td>
          <div className='d-flex justify-content-center'>
            <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" type='button' onClick={() => handleShowDetail(item)}>
             <i className="far fa-rectangle-list"></i>
            </button>
           </div>
         </td> */}
          <td class="align-middle white-space-nowrap text-center pe-0">
          <div class="btn-reveal-trigger position-static">
            <button class="btn btn-phoenix-secondary btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs-10" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span class="fas fa-ellipsis-h fs-10"></span></button>
            <div class="dropdown-menu dropdown-menu-end py-2">
              <button className="dropdown-item" type="button" onClick={() => handleShowDetail(item)}>รายละเอียดหลักทรัพย์</button>
              <button className="dropdown-item" type="button" onClick={() => handleOperation(item)}>การดำเนินการในที่ดิน</button>
              <button className="dropdown-item" type="button" onClick={() => handleSurvey(item)}>การรังวัด</button>
              <button className="dropdown-item" type="button" onClick={() => handleLandLease(item)}>การเช่า</button>
              <button className="dropdown-item" type="button" onClick={() => handleExpropriation(item)}>การเวนคืน</button>
            </div>
          </div>
        </td>
         <td>{item.k_idcard}</td>
         <td>{item.k_name_prefix}</td>
        <td>{(item.k_firstname ?? '') + ' ' + (item.k_lastname ?? '')}</td>
        <td>{item.loan_province}</td>
        <td>{item.policyNO}</td>
        <td>{item.indexAssetPolicy}</td>
        <td>{item.assetType}</td>
        <td>{item.collateralOwner}</td>
        <td>{item.collateral_no}</td>
        <td>{item.collateral_province}</td>
        <td>{item.collateral_district}</td>
        <td>{item.collateral_sub_district}</td>
        <td>{item.contract_area_rai}</td>
        <td>{item.contract_area_ngan}</td>
        <td>{item.contract_area_sqaure_wa}</td>
        <td>{item.deedBorrowReturn_status}</td>
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
                <th colSpan="4">เกษตรกร</th>
                <th colSpan="11">หลักประกัน</th>
                <th rowSpan="2">สถานะยืม-คืนโฉนด</th>
              </tr>
              <tr>
                <th>เลขบัตรประชาชน</th>
                <th>คำนำหน้า</th>
                <th>ชื่อ-นามสกุล</th>
                <th>จังหวัด</th>
                <th>เลขที่นิติกรรมสัญญา</th>
                <th>ดัชนีจัดเก็บหลักประกัน</th>
                <th>ประเภทหลักประกัน</th>
                <th>เจ้าของหลักประกัน</th>
                <th>เลขที่หลักประกัน</th>
                <th>จังหวัด</th>
                <th>อำเภอ</th>
                <th>ตำบล</th>
                <th>ไร่</th>
                <th>งาน</th>
                <th>ตารางวา</th>
                
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