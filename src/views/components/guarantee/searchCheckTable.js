import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
import { stringToDateTh, toCurrency } from "@utils";
const SearchTable = (props) => {
  const { result, filter, getData, handleShowDetail, handlePlan, handleAsset, handleGuarantor, handleReturnGuarantee,handleSpouse, handleSubmit, handleUpload, handleEdit, handleReturn
    , handleViewEdit, handleViewEditAsset, handleViewReturn
  } = props;
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(null);
  const [isSome, setIsSome] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [selected, setSelected] = useState([]);
  const onEdit = () => {
    if (handleSubmit) {
      const selectedData = data.filter((i, index) => selected[index]);
      // save session
      handleEdit(selectedData)
    }
  }
  const onReturn = () => {
    if (handleSubmit) {
      const selectedData = data.filter((i, index) => selected[index]);
      // save session
      handleReturn(selectedData)
    }
  }
  const onSubmit = () => {
    if (handleSubmit) {
      const selectedData = data.filter((i, index) => selected[index]);
      // save session
      handleSubmit(selectedData)
    }
  }
  const onChange = async (id) => {
    await setSelected((prev) => {
      prev[id] = !prev[id];
      return [...prev]
    })
  }
  const onHeaderChange = async (checked) => {
    await setSelected(result.data.map((item) => (checked && item.document_name)));
  }
  const RenderData = (item, index, checked) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">
          <div className="form-check ms-2 mb-0 fs-8">
            <input className="form-check-input" disabled={!item.document_name} type="checkbox" checked={checked} onChange={() => onChange(index)} />
          </div>
        </td>
        <td style={{ paddingBlock: 10 }}>
          {item.document_name ? (
            <>
              <div class="d-flex justify-content-center"> 
                <button class="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" onClick={() => handleUpload(item)}><i class="far fa-file"></i></button>
              </div>
              {item.document_name}
            </>
          ) : (
            <div class="d-flex justify-content-center"> 
              <button class="btn btn-phoenix-secondary btn-icon fs-7 text-danger-dark px-0" onClick={() => handleUpload(item)}><i class="far fa-file"></i></button>
            </div>
          )}
        </td>
        <td>{item.branch_policy_no}</td>
        <td>{item.branch_policy_date ? stringToDateTh(item.branch_policy_date, false) : '-'}</td>
        <td>{item.k_idcard}</td>
        <td>{item.k_name_prefix}</td>
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
      setPaging({ currentPage: result.currentPage, total: result.total, totalPage: result.totalPage });
      setSelected(result.data.map(() => false))
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
                <th colSpan="2">หนังสือนำส่งสาขา</th>
                <th colSpan="4">เกษตรกร</th>
                <th colSpan="5">นิติกรรมสัญญา</th>
                <th colSpan="10">หลักทรัพย์</th>
                <th rowSpan="2">รายละเอียดหลักทรัพย์</th>
              </tr>
              <tr>
                <th>เลขที่</th>
                <th>วันที่</th>
                <th>เลขบัตรประชาชน</th>
                <th>คำนำหน้า</th>
                <th>ชื่อ-นามสกุล</th>
                <th>จังหวัด</th>
                <th>เลขที่นิติกรรมสัญญา</th>
                <th>ประเภทจัดการหนี้</th>
                <th>วันที่ทำสัญญา</th>
                <th>ยอดเงินตามสัญญา</th>
                <th>จำนวนเงินที่ชดเชย</th>
                <th>สถานะการโอนหลักทรัพท์</th>
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
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index, selected[index] ?? false))) : (
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
            <button className="btn btn-warning btn-sm ms-2" type="button" onClick={() => onEdit()}>แก้ไขโอนหลักทรัพย์</button>
            <button className="btn btn-danger btn-sm ms-2" type="button" onClick={() => onReturn()}>ส่งคืนโอนหลักทรัพย์</button>
            <button className="btn btn-primary btn-sm ms-2" type="button" onClick={() => onSubmit()}>ส่งบริหารสินทรัพย์</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default SearchTable;