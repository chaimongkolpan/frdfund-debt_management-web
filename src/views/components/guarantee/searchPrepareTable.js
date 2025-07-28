import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
import { stringToDateTh, toCurrency } from "@utils";
const SearchTable = (props) => {
  const { result, filter, getData, handleShowDetail, handlePlan, handleAsset, handleGuarantor, handleReturnGuarantee,handleSpouse, handleSubmit } = props;
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(null);
  const [isSome, setIsSome] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [selected, setSelected] = useState([]);
  const onHeaderChange = async (checked) => {
    await setSelected(result.data.map((item) => (checked )));
  }
  const onSubmit = () => {
    if (handleSubmit) {
      const selectedData = data.filter((i, index) => selected[index]);
      // save session
      handleSubmit(selectedData)
    }
  }
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index} style={{ backgroundColor: `${item.transferStatus == "แก้ไขโอนหลักทรัพย์" ? "#feebc9" : item.transferStatus == "ส่งคืนโอนหลักทรัพย์" ? "#fdeae7" : "#ffffff"}` }}>
        <td className="fs-9 align-middle">
          <div className="form-check ms-2 mb-0 fs-8">
            <input
              className="form-check-input"
              type="checkbox"
              disabled={!item.k_idcard}
              checked={selected[index] ?? false}
              onChange={() => {
                const updated = [...selected];
                updated[index] = !updated[index];
                setSelected(updated);
              }}
            />
          </div>
        </td>
        <td>{item.k_idcard}</td>
        <td>{item.k_name_prefix}</td>
        <td>{(item.k_firstname ?? '') + ' ' + (item.k_lastname ?? '')}</td>
        <td>{item.loan_province}</td>
        <td>{item.policyNO}</td>
        <td>{item.loan_debt_type}</td>
        <td>{item.policyStartDate ? stringToDateTh(item.policyStartDate, false) : '-'}</td>
        <td>{toCurrency(item.loan_amount)}</td>
        <td>{toCurrency(item.compensation_amount)}</td>
        <td>{item.transferStatus}</td>
        <td>{item.numberOfDay}</td>
        <td>{item.assetType}</td>
        <td>{item.collateral_no}</td>
        <td>{item.collateral_province}</td>
        <td>{item.collateral_district}</td>
        <td>{item.collateral_sub_district}</td>
        <td>{`${item.contract_area_rai ? item.contract_area_rai : 0}`}</td>
        <td>{`${item.contract_area_ngan ? item.contract_area_ngan : 0}`}</td>
        <td>{`${item.contract_area_sqaure_wa ? item.contract_area_sqaure_wa : 0}`}</td>
        <td class="align-middle white-space-nowrap text-center pe-0">
          <div class="btn-reveal-trigger position-static">
            <button class="btn btn-phoenix-secondary btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs-10" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span class="fas fa-ellipsis-h fs-10"></span></button>
            <div class="dropdown-menu dropdown-menu-end py-2">
              <button className="dropdown-item" type="button" onClick={() => handleShowDetail(item)}>ข้อมูลหลักทรัพย์ค้ำประกัน</button>
              <button className="dropdown-item" type="button" onClick={() => handlePlan(item)}>เลื่อนโอนหลักทรัพย์</button>
              <button className="dropdown-item" type="button" onClick={() => handleAsset(item)}>ข้อมูลโอนหลักทรัพย์</button>
              <button className="dropdown-item" type="button" onClick={() => handleGuarantor(item)}>ข้อมูลแก้ไขโอนหลักทรัพย์</button>
              <button className="dropdown-item" type="button" onClick={() => handleSpouse(item)}>ข้อมูลแก้ไขโอนหลักทรัพย์ (บริหารสินทรัพย์)</button>
              <button className="dropdown-item" type="button" onClick={() => handleReturnGuarantee(item)}>ข้อมูลส่งคืนโอนหลักทรัพย์</button>
            </div>
          </div>
        </td>
      </tr>
    ))
  }
  const RenderAll = () => {
    return (data && data.length > 0) ? (data.map((item,index) => RenderData(item, index, selected[index] ?? false))) : (
      <tr>
        <td className="fs-9 text-center align-middle" colSpan={26}>
          <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
        </td>
      </tr>
    )
  }
  useEffect(() => {
    setIsSome(selected.some(i => i))
    setIsAll(selected.every(i => i) && selected.length > 0)
    RenderAll();
    return () => { console.log('Clear data.') }
  },[selected])
  useEffect(() => {
    if(result) {
      setData(result.data);
      setPaging({ currentPage: result.currentPage, total: result.total, totalPage: result.totalPage })
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
              <th className="white-space-nowrap fs-9 align-middle ps-0" rowSpan="2">
                  <div className="form-check ms-2 me-0 mb-0 fs-8">
                    <input className={`form-check-input ${(isSome && !isAll && data.length > 0) ? 'some' : ''}`} type="checkbox" checked={isAll} onChange={() => onHeaderChange(!isAll)} />
                  </div>
                </th>
                <th colSpan="4">เกษตรกร</th>
                <th colSpan="5">นิติกรรมสัญญา</th>
                <th colSpan="10">หลักทรัพย์</th>
                <th rowSpan="2">รายละเอียดหลักทรัพย์</th>
              </tr>
              <tr>
                <th>เลขบัตรประชาชน</th>
                <th>คำนำหน้า</th>
                <th>ชื่อ-นามสกุล</th>
                <th>จังหวัด</th>
                <th>เลขที่นิติกรรมสัญญา</th>
                <th>ประเภทจัดการหนี้</th>
                <th>วันที่ทำสัญญา</th>
                <th>ยอดเงินตามสัญญา</th>
                <th>จำนวนเงินที่ชดเชย</th>
                <th>สถานะการโอนหลักทรัพย์</th>
                <th>จำนวนวัน</th>
                <th>ประเภทหลักทรัพย์</th>
                <th>หลักทรัพย์เลขที่</th>
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
      <div className="d-flex align-items-center justify-content-center my-3">
        <div className={`${isSome ? '' : 'd-none'}`}>
          <div className="d-flex">
            <button className="btn btn-primary btn-sm ms-2" type="button" onClick={() => onSubmit()}>โอนหลักทรัพย์</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default SearchTable;