import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
import { stringToDateTh, toCurrency } from "@utils";
const SearchTable = (props) => {
  const { result, filter, getData, handleShowDetail, handleOperation
  } = props;
  const [data, setData] = useState([
    {
      "id_KFKPolicy": 0,
      "policyNO": "string",
      "id_debt_management": "string",
      "k_idcard": "string",
      "k_name_prefix": "string",
      "k_firstname": "string",
      "k_lastname": "string",
      "loan_province": "string",
      "indexAssetPolicy": "string",
      "collateralOwner": "string",
      "assetType": "string",
      "parceL_no": "string",
      "pre_emption_volume_no": "string",
      "nS3_dealing_file_no": "string",
      "nS3A_no": "string",
      "nS3B_no": "string",
      "alrO_plot_no": "string",
      "condO_parcel_no": "string",
      "labT5_parcel_no": "string",
      "house_no": "string",
      "chattel_engine_no": "string",
      "otheR_volume": "string",
      "parceL_province": "string",
      "pre_emption_province": "string",
      "nS3_province": "string",
      "nS3A_province": "string",
      "nS3B_province": "string",
      "alrO_province": "string",
      "condO_province": "string",
      "labT5_province": "string",
      "house_province": "string",
      "otheR_province": "string",
      "parceL_district": "string",
      "pre_emption_district": "string",
      "nS3_district": "string",
      "nS3A_district": "string",
      "nS3B_district": "string",
      "alrO_district": "string",
      "condO_district": "string",
      "labT5_district": "string",
      "house_district": "string",
      "otheR_district": "string",
      "parceL_sub_district": "string",
      "pre_emption_sub_district": "string",
      "nS3_sub_district": "string",
      "nS3A_sub_district": "string",
      "nS3B_sub_district": "string",
      "alrO_sub_district": "string",
      "condO_sub_district": "string",
      "labT5_sub_district": "string",
      "house_sub_district": "string",
      "otheR_sub_district": "string",
      "contract_area_rai": "string",
      "contract_area_ngan": "string",
      "contract_area_sqaure_wa": 0,
      "borrowdeed_no": "string",
      "borrowdeed_date": "2025-07-21T19:01:22.578Z",
      "borrowdeed_reason": "string",
      "returndeed_no": "string",
      "returndeed_date": "2025-07-21T19:01:22.578Z",
      "returndeed_remark": "string",
      "asset_operations_type": "string",
      "asset_operations_other": "string",
      "req_docu": "string",
      "borrowdeed_docu": "string",
      "approve_docu": "string",
      "results_docu": "string",
      "report_docu": "string"
    }
  ]);
  const [paging, setPaging] = useState(null);
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">{index + 1}</td>
        <td>
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
         </td>
         <td>{item.k_idcard}</td>
         <td>{item.k_name_prefix}</td>
        <td>{(item.k_firstname ?? '') + ' ' + (item.k_lastname ?? '')}</td>
        <td>{item.loan_province}</td>
        <td>{item.policyNO}</td>
        <td>{item.indexAssetPolicy}</td>
        <td>{item.collateralOwner}</td>
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
      //setData(result.data);
      setData([{
        "id_KFKPolicy": 0,
        "policyNO": "string",
        "id_debt_management": "string",
        "k_idcard": "string",
        "k_name_prefix": "string",
        "k_firstname": "string",
        "k_lastname": "string",
        "loan_province": "string",
        "indexAssetPolicy": "string",
        "collateralOwner": "string",
        "assetType": "string",
        "parceL_no": "string",
        "pre_emption_volume_no": "string",
        "nS3_dealing_file_no": "string",
        "nS3A_no": "string",
        "nS3B_no": "string",
        "alrO_plot_no": "string",
        "condO_parcel_no": "string",
        "labT5_parcel_no": "string",
        "house_no": "string",
        "chattel_engine_no": "string",
        "otheR_volume": "string",
        "parceL_province": "string",
        "pre_emption_province": "string",
        "nS3_province": "string",
        "nS3A_province": "string",
        "nS3B_province": "string",
        "alrO_province": "string",
        "condO_province": "string",
        "labT5_province": "string",
        "house_province": "string",
        "otheR_province": "string",
        "parceL_district": "string",
        "pre_emption_district": "string",
        "nS3_district": "string",
        "nS3A_district": "string",
        "nS3B_district": "string",
        "alrO_district": "string",
        "condO_district": "string",
        "labT5_district": "string",
        "house_district": "string",
        "otheR_district": "string",
        "parceL_sub_district": "string",
        "pre_emption_sub_district": "string",
        "nS3_sub_district": "string",
        "nS3A_sub_district": "string",
        "nS3B_sub_district": "string",
        "alrO_sub_district": "string",
        "condO_sub_district": "string",
        "labT5_sub_district": "string",
        "house_sub_district": "string",
        "otheR_sub_district": "string",
        "contract_area_rai": "string",
        "contract_area_ngan": "string",
        "contract_area_sqaure_wa": 0,
        "borrowdeed_no": "string",
        "borrowdeed_date": "2025-07-21T19:01:22.578Z",
        "borrowdeed_reason": "string",
        "returndeed_no": "string",
        "returndeed_date": "2025-07-21T19:01:22.578Z",
        "returndeed_remark": "string",
        "asset_operations_type": "string",
        "asset_operations_other": "string",
        "req_docu": "string",
        "borrowdeed_docu": "string",
        "approve_docu": "string",
        "results_docu": "string",
        "report_docu": "string"
      }]);
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