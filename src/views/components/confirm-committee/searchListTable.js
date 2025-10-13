import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
import { stringToDateTh, toCurrency } from "@utils";
import DatePicker from "@views/components/input/DatePicker";
import BookNo from "@views/components/input/BookNo";
import EditDetail from "@views/components/confirm-committee/editDetail";
import CustomerModal from "@views/components/modal/customModal";
import { 
  updateConfirmCommitteeCreditor,
  updateConfirmCommitteeNo,
  submitConfirmCommitteePrepare,
  updateNPLstatus,
  cleanData
} from "@services/api";
const SearchTable = (props) => {
  const { result, handleSubmit, filter, getData, can_action } = props;
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
  const handleShowDetail = async(item) => {
    await setEditData(item);
    await setOpenDetail(true);
  }
  const handleCloseDetail = async() => {
    await getData(filter);
    await setOpenDetail(false);
  }
  const RenderData = (item, index, checked) => {
    return (item && (
      <tr key={index} style={{ backgroundColor: `${item.status_confirm == "แก้ไขยืนยันยอด" && false ? "#fdeae7" : "#ffffff" }`  }}>
        <td className="fs-9 align-middle">
          {can_action ? (
            <div className="form-check ms-2 mb-0 fs-8">
              <input className="form-check-input" type="checkbox" checked={checked} onChange={() => onChange(index)} />
            </div>
          ) : (((paging?.currentPage - 1) * process.env.VITE_.PAGESIZE) + index + 1)}
        </td>
        <td>
          <div className="d-flex justify-content-center"> 
            <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" disabled={!can_action} onClick={() => handleShowDetail(item)}><i className="far fa-eye "></i></button>
          </div>
        </td>
        <td>{item.proposal_committee_no}</td>
        <td>{item.proposal_committee_date ? stringToDateTh(item.proposal_committee_date, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.branch_correspondence_no}</td>
        <td>{item.branch_correspondence_date ? stringToDateTh(item.branch_correspondence_date, false, 'DD/MM/YYYY') : '-'}</td>
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
        <td>{item.debt_manage_status}</td>
        <td>{item.collateral_type}</td>
        <td>{item.debt_manage_objective_details}</td>
        {item.status_confirm == "แก้ไขยืนยันยอด" ? (
          <>
            <td>{toCurrency(item.debt_manage_outstanding_principal_cf)}</td>
            <td>{toCurrency(item.debt_manage_accrued_interest_cf)}</td>
            <td>{toCurrency(item.debt_manage_fine_cf)}</td>
            <td>{toCurrency(item.debt_manage_litigation_expenses_cf)}</td>
            <td>{toCurrency(item.debt_manage_forfeiture_withdrawal_fee_cf)}</td>
            {!coop && (
              <>
                <td>{toCurrency(item.debt_manage_insurance_premium_cf)}</td>
                <td>{toCurrency(item.debt_manage_other_expenses_cf)}</td>
              </>
            )}
            <td>{toCurrency(item.debt_manage_total_expenses_cf)}</td>
            <td>{toCurrency(item.debt_manage_total_cf)}</td>
            <td>{item.debt_manage_status_cf}</td>
            <td>{item.status_confirm}</td>
            <td>{item.results_confirm}</td>
          </>
        ) : (
          <>
            <td></td><td></td><td></td><td></td><td></td>
            {!coop && (
              <>
                <td></td><td></td>
              </>
            )}
            <td></td><td></td><td></td><td></td><td></td>
          </>
        )}
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
                <th rowSpan="2">ดำเนินการ</th>
                <th colSpan="2">คณะกรรมการจัดการหนี้</th>
                <th colSpan="2">สาขายืนยันยอด</th>
                <th colSpan="4">เกษตรกร</th>
                <th colSpan="4">เจ้าหนี้</th>
                <th colSpan={coop ? "11" : "13"}>สัญญา</th>
                <th colSpan={coop ? "10" : "12"}>ยืนยันยอด</th>
              </tr>
              <tr>
                <th>ครั้งที่เสนอคณะกรรมการ</th>
                <th>วันที่เสนอคณะกรรมการ</th>
                <th>เลขที่หนังสือสาขายืนยันยอด</th>
                <th>วันที่หนังสือสาขายืนยันยอด</th>
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
                <th>สถานะหนี้</th>
                <th>ประเภทหลักประกัน</th>
                <th>วัตถุประสงค์การกู้</th>
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
                <th>สถานะยืนยันยอด</th>
                <th>ผลการยืนยันยอด</th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle" id="bulk-select-body">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index, selected[index]))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={coop ? 36 : 38}>
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
              <button className="btn btn-subtle-success btn-sm ms-2" type="button" onClick={() => onSubmit()}>เลือกสัญญายืนยันยอด</button>
            </div>
          </div>
        </div>
      )}
      {isOpenDetail && (
        <EditDetail isOpen={isOpenDetail} setModal={setOpenDetail} onClose={() => handleCloseDetail()} 
          data={editData} isView
        />
      )}
    </>
  );
};
export default SearchTable;