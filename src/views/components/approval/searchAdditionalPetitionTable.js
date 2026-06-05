import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
import { stringToDateTh, toCurrency } from "@utils";
import EditDetail from "@views/components/approval/editDetail";
const SearchTable = (props) => {
  const { result, handleSubmit, handleReject, filter, getData, can_action } = props;
  const [data, setData] = useState([]);
  const [coop, setCoop] = useState(true);
  const [paging, setPaging] = useState(null);
  const [isSome, setIsSome] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isOpenDetail, setOpenDetail] = useState(false);
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
    await setSelected(result.data.map((item) => item.status_refund != 'อนุมัติเพิ่มเงินแล้ว' && checked));
    await setIsAll(checked)
  }
  const RenderData = (item, index, checked) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">
          {can_action ? (
            <div className="form-check ms-2 mb-0 fs-8">
              <input className="form-check-input" disabled={item.status_refund == 'อนุมัติเพิ่มเงินแล้ว'} type="checkbox" checked={checked} onChange={() => onChange(index)} />
            </div>
          ) : (((paging?.currentPage - 1) * process.env.VITE_PAGESIZE) + index + 1)}
        </td>
        <td>{item.book_no}</td>
        <td>{item.book_date}</td>
        <td>{item.proposal_committee_no}</td>
        <td>{item.proposal_committee_date}</td>
        <td>{item.id_card}</td>
        <td>{item.name_prefix}</td>
        <td>{(item.firstname ?? '') + ' ' + (item.lastname ?? '')}</td>
        <td>{item.province}</td>
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

        <td>{toCurrency(item.debt_manage_outstanding_principal_pay)}</td>
        <td>{toCurrency(item.debt_manage_accrued_interest_pay)}</td>
        <td>{toCurrency(item.debt_manage_fine_pay)}</td>
        <td>{toCurrency(item.debt_manage_litigation_expenses_pay)}</td>
        <td>{toCurrency(item.debt_manage_forfeiture_withdrawal_fee_pay)}</td>
        {!coop && (
          <>
            <td>{toCurrency(item.debt_manage_insurance_premium_pay)}</td>
            <td>{toCurrency(item.debt_manage_other_expenses_pay)}</td>
          </>
        )}
        <td>{toCurrency(item.debt_manage_total_expenses_pay)}</td>
        <td>{toCurrency(item.debt_manage_total_pay)}</td>

        <td>{toCurrency(item.debt_manage_outstanding_principal_additional)}</td>
        <td>{toCurrency(item.debt_manage_accrued_interest_additional)}</td>
        <td>{toCurrency(item.debt_manage_fine_additional)}</td>
        <td>{toCurrency(item.debt_manage_litigation_expenses_additional)}</td>
        <td>{toCurrency(item.debt_manage_forfeiture_withdrawal_fee_additional)}</td>
        {!coop && (
          <>
            <td>{toCurrency(item.debt_manage_insurance_premium_additional)}</td>
            <td>{toCurrency(item.debt_manage_other_expenses_additional)}</td>
          </>
        )}
        <td>{toCurrency(item.debt_manage_total_expenses_additional)}</td>
        <td>{toCurrency(item.debt_manage_total_additional)}</td>

        <td>{item.status_additional}</td>
        <td>{item.debt_management_audit_status}</td>
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
                <th className="white-space-nowrap fs-9 align-middle ps-0" rowSpan="2" style={{ minWidth: 30 }}>
                  {can_action ? (
                    <div className="form-check ms-2 me-0 mb-0 fs-8">
                      <input className={`form-check-input ${(isSome && !isAll && data.length > 0) ? 'some' : ''}`} type="checkbox" checked={isAll} onChange={() => onHeaderChange(!isAll)} />
                    </div>
                  ) : '#'}
                </th>
                          <th colSpan="2">เพิ่มเงินชำระหนี้เกษตรกร</th>
                          <th colSpan="2">คณะกรรมการจัดการหนี้</th>
                          <th colSpan="4">เกษตรกร</th>
                          <th colSpan="4">เจ้าหนี้</th>
                          <th colSpan={coop ? "8" : "10"}>โอนเงินให้สาขา</th>
                          <th colSpan={coop ? "7" : "9"}>ชำระหนี้แทน</th>
                          <th colSpan={coop ? "7" : "9"}>เพิ่มเงินชำระหนี้เกษตรกร</th>
                          <th rowSpan="2">สถานะเพิ่มเงิน</th>
                          <th rowSpan="2">สถานะสัญญา</th>
              </tr>
              <tr>
                <th>เลขที่หนังสือสาขา</th>
                <th>วันที่หนังสือสาขา</th>
                <th>ครั้งที่เสนอคณะกรรมการ</th>
                <th>วันที่เสนอคณะกรรมการ</th>
                          <th>เลขบัตรประชาชน</th>
                          <th>คำนำหน้า</th>
                          <th>ชื่อ-นามสกุล</th>
                          <th>จังหวัด</th>
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
              </tr>
            </thead>
            <tbody className="list text-center align-middle" id="bulk-select-body">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index, selected[index]))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={coop ? 24 : 26}>
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
      {can_action && (
        <div className="d-flex align-items-center justify-content-center my-3">
          <div className={`${isSome ? '' : 'd-none'}`}>
            <div className="d-flex">
              <button className="btn btn-subtle-success btn-sm ms-2" type="button" onClick={() => onSubmit()}>เพิ่มเงินชำระหนี้เกษตรกร</button>
              <button className="btn btn-subtle-danger btn-sm ms-2" type="button" onClick={() => onReject()}>ส่งคืนสาขา</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
export default SearchTable;