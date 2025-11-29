import { useEffect, useState } from "react";
import { stringToDateTh, toCurrency } from "@utils";
const DataTable = (props) => {
  const { result, handleSubmit, handleReject, can_action } = props;
  const [data, setData] = useState([]);
  const [coop, setCoop] = useState(true);
  const [isSome, setIsSome] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [selected, setSelected] = useState([]);
  const onSubmit = () => {
    if (handleSubmit) {
      const selectedData = data.filter((i, index) => selected[index]);
      handleSubmit(selectedData)
    }
  }
  const onReject = () => {
    if (handleReject) {
      const selectedData = data.filter((i, index) => selected[index]);
      handleReject(selectedData)
    }
  }
  const onChange = async (id) => {
    await setSelected((prev) => {
      prev[id] = !prev[id];
      return [...prev]
    })
  }
  const onHeaderChange = async (checked) => {
    await setSelected(result.data.map(() => checked));
    await setIsAll(checked)
  }
  const RenderData = (item, index, checked) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">
          {can_action ? (
            <div className="form-check ms-2 mb-0 fs-8">
              <input className="form-check-input" type="checkbox" 
                disabled={item.debt_management_audit_status != 'รอเสนอคณะกรรมการจัดการหนี้'} 
                checked={checked} onChange={() => onChange(index)} />
            </div>
          ) : (index + 1)}
        </td>
        <td>
          {item.debt_management_audit_status == 'รอเสนอคณะกรรมการจัดการหนี้' ? null : 
          (item.debt_management_audit_status == 'คณะกรรมการจัดการหนี้ไม่อนุมัติ' ? (<i className="fas fa-times text-danger fs-7"></i>) : 
          (<i className="fas fa-check text-success fs-7"></i>))}
        </td>
        <td>{item.proposal_committee_no}</td>
        <td>{item.proposal_committee_date}</td>
        {coop && (
          <td>{item.proposal_type ? 'ชำระหนี้แทน' : 'วางเงินชำระหนี้'}</td>
        )}
        <td>{item.id_card}</td>
        <td>{item.name_prefix}</td>
        <td>{(item.firstname ?? '') + ' ' + (item.lastname ?? '')}</td>
        <td>{item.province}</td>
        <td>{item.organization_register_round}</td>
        <td>{item.debt_register_round}</td>
        <td>{item.province}</td>
        <td>{item.passed_approval_no}</td>
        <td>{item.passed_approval_date ? stringToDateTh(item.passed_approval_date, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.debt_manage_creditor_type}</td>
        <td>{item.debt_manage_creditor_name}</td>
        <td>{item.debt_manage_creditor_province}</td>
        <td>{item.debt_manage_creditor_branch}</td>
        <td>{item.debt_manage_contract_no}</td>
        <td>{toCurrency(item.debt_manage_outstanding_principal)}</td>
        <td>{toCurrency(item.debt_manage_accrued_interest)}</td>
        <td>{toCurrency(item.debt_manage_fine)}</td>
        <td>{toCurrency(item.debt_manage_litigation_expenses)}</td>
        <td>{toCurrency(item.debt_manage_forfeiture_withdrawal_fee)}</td>
        {!coop && (
          <>
            <td>{toCurrency(item.debt_manage_insurance_premium)}</td>
            <td>{toCurrency(item.debt_manage_other_expenses)}</td>
          </>
        )}
        <td>{toCurrency(item.debt_manage_total_expenses)}</td>
        <td>{toCurrency(item.debt_manage_total)}</td>
        <td>{item.debt_manage_status}</td>
        <td>{item.debt_manage_objective}</td>
        <td>{item.debt_manage_objective_details}</td>
        <td>{item.debt_manage_payment_default_date ? stringToDateTh(item.debt_manage_payment_default_date, false) : '-'}</td>
        <td>{item.debt_manage_calculate_ondate ? stringToDateTh(item.debt_manage_calculate_ondate, false) : '-'}</td>
        <td>{item.collateral_type}</td>
        <td>{item.collateral_no}</td>
        <td>{item.collateral_no ? '1' : '0'}</td>
        <td>{item.collateral_status}</td>
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
      setCoop(result.data && result.data[0]?.debt_manage_creditor_type == 'สหกรณ์')
      setSelected(result.data.map(() => false));
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
                <th className="white-space-nowrap fs-9 align-middle ps-0" rowSpan="2" style={{ minWidth: 30 }}>
                  {can_action ? (
                    <div className="form-check ms-2 me-0 mb-0 fs-8">
                      <input className={`form-check-input ${(isSome && !isAll && data.length > 0) ? 'some' : ''}`} type="checkbox" checked={isAll} onChange={() => onHeaderChange(!isAll)} />
                    </div>
                  ) : '#'}
                </th>
                <th rowSpan="2">สถานะอนุมัติ</th>
                <th rowSpan="2">ครั้งที่เสนอคณะกรรมการ</th>
                <th rowSpan="2">วันที่เสนอคณะกรรมการ</th>
                {coop && (
                  <th rowSpan="2">ขออนุมัติโดย (ชำระหนี้แทน/วางเงินชำระหนี้)</th>
                )}
                <th colSpan="4">เกษตรกร</th>
                <th colSpan="1">องค์กร</th>
                <th colSpan="4">ทะเบียนหนี้</th>
                <th colSpan="4">เจ้าหนี้</th>
                <th colSpan={coop ? "14" : "16"}>สัญญา</th>
                <th colSpan="3">หลักทรัพย์ค้ำประกัน</th>
              </tr>
              <tr>
                <th>เลขบัตรประชาชน</th>
                <th>คำนำหน้า</th>
                <th>ชื่อ-นามสกุล</th>
                <th>จังหวัด</th>
                <th>รอบองค์กร</th>
                <th>รอบหนี้</th>
                <th>วันที่ยื่นขึ้นทะเบียนหนี้</th>
                <th>ผ่านความเห็นชอบครั้งที่</th>
                <th>ผ่านความเห็นชอบวันที่</th>
                <th>ประเภทเจ้าหนี้</th>
                <th>สถาบันเจ้าหนี้</th>
                <th>จังหวัดเจ้าหนี้</th>
                <th>สาขาเจ้าหนี้</th>
                <th>เลขที่สัญญา</th>
                <th>เงินต้น</th>
                <th>ดอกเบี้ย</th>
                <th>ค่าปรับ</th>
                <th>ค่าใช้จ่ายในการดำเนินคดี</th>
                <th>ค่าถอนการยึดทรัพย์</th>
                {!coop && (
                  <>
                    <th>ค่าเบี้ยประกัน</th>
                    <th>ค่าใช้จ่ายอื่นๆ</th>
                  </>
                )}
                <th>รวมค่าใช้จ่าย</th>
                <th>รวมทั้งสิ้น</th>
                <th>สถานะหนี้</th>
                <th>วัตถุประสงค์การกู้</th>
                <th>รายละเอียดวัตถุประสงค์การกู้</th>
                <th>วันที่ผิดนัดชำระ</th>
                <th>คำนวณดอกเบี้ยถึงวันที่</th>
                <th>ประเภทหลักประกัน</th>
                <th>ประเภทและเลขที่หลักทรัพย์(เลขโฉนด)</th>
                <th>จำนวนแปลง</th>
                <th>การตรวจสอบการอายัด</th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle" id="bulk-select-body">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index, selected[index]))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={coop ? 34 : 35}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {can_action && (
        <div className="d-flex align-items-center justify-content-center my-3">
          <div className={`${isSome ? '' : 'd-none'}`}>
            <div className="d-flex">
              <button className="btn btn-success btn-sm ms-2" type="button" onClick={() => onSubmit()}><span className="fas fa-check"></span> อนุมัติ</button>
              <button className="btn btn-danger btn-sm ms-2" type="button" onClick={() => onReject()}><span className="fas fa-times"></span> ไม่อนุมัติ</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default DataTable;