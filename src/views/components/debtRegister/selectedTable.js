import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
import { stringToDateTh } from "@utils";
const DebtRegisterSelectedTable = (props) => {
  const { result, handleSubmit, handleRemove, filter, getData } = props;
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(null);
  const [isSome, setIsSome] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [selected, setSelected] = useState([]);
  const onSubmit = () => {
    if (handleSubmit) {
      const selectedData = data.filter((i, index) => selected[index]);
      handleSubmit(selectedData)
    }
  }
  const onRemove = () => {
    if (handleRemove) {
      const selectedData = data.filter((i, index) => selected[index]);
      handleRemove(selectedData)
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
          <div className="form-check ms-2 mb-0 fs-8">
            <input className="form-check-input" type="checkbox" checked={checked} onChange={() => onChange(index)} />
          </div>
        </td>
        <td>{item.id_card}</td>
        <td>{item.name_prefix}</td>
        <td>{(item.firstname ?? '') + ' ' + (item.lastname ?? '')}</td>
        <td>{item.province}</td>
        <td>{item.date_member_first_time ? stringToDateTh(item.date_member_first_time, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.date_member_current ? stringToDateTh(item.date_member_current, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.organization_register_round}</td>
        <td>{item.organization_name}</td>
        <td>{item.organization_no}</td>
        <td>{item.debt_register_round}</td>
        <td>{item.date_submit_debt_register ? stringToDateTh(item.date_submit_debt_register, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.passed_approval_no}</td>
        <td>{item.passed_approval_date ? stringToDateTh(item.passed_approval_date, false, 'DD/MM/YYYY') : '-'}</td>
        <td>{item.creditor_type}</td>
        <td>{item.creditor_name}</td>
        <td>{item.creditor_province}</td>
        <td>{item.creditor_branch}</td>
        <td>{item.contract_no}</td>
        <td>{item.remaining_principal_contract}</td>
        <td>{item.dept_status}</td>
        <td>{item.collateral_type}</td>
        <td>{item.purpose_loan_contract}</td>
        <td>{item.purpose_type_loan_contract}</td>
        <td>{item.status}</td>
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
      setSelected(result.data.map(() => false));
      setPaging({ currentPage: result.currentPage, total: result.total, totalPage: result.totalPage })
    }
    return () => { setData([]) }
  },[result])
  return (
    <>
      <div id="tableExample1" data-list='{"valueNames":["name","email","age"]'>
        <div className="table-responsive mx-n1 px-1">
          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
              <tr>
                <th className="white-space-nowrap fs-9 align-middle ps-0" rowSpan="2">
                  <div className="form-check ms-2 mb-0 fs-8">
                    <input className={`form-check-input ${(isSome && !isAll && data.length > 0) ? 'some' : ''}`} type="checkbox" checked={isAll} onChange={() => onHeaderChange(!isAll)} />
                  </div>
                </th>
                <th colspan="7">เกษตรกร</th>
                <th colspan="2">องค์กร</th>
                <th colspan="4">ทะเบียนหนี้</th>
                <th colspan="4">เจ้าหนี้</th>
                <th colspan="7">สัญญา</th>
              </tr>
              <tr>
                <th >เลขบัตรประชาชน</th>
                <th>คำนำหน้า</th>
                <th >ชื่อ-นามสกุล</th>
                <th >จังหวัด</th>
                <th>วันที่เป็นสมาชิก (ครั้งแรก)</th>
                <th>วันที่ขึ้นทะเบียนองค์กรปัจจุบัน</th>
                <th>รอบองค์กร</th>
                <th>ชื่อองค์กรการเกษตร</th>
                <th>หมายเลของค์กร</th>
                <th>รอบหนี้</th>
                <th>วันที่ยื่นขึ้นทะเบียนหนี้</th>
                <th>ผ่านความเห็นชอบครั้งที่</th>
                <th>ผ่านความเห็นชอบวันที่</th>
                <th>ประเภทเจ้าหนี้</th>
                <th>สถาบันเจ้าหนี้</th>
                <th>จังหวัดเจ้าหนี้</th>
                <th>สาขาเจ้าหนี้</th>
                <th>เลขที่สัญญา</th>
                <th>เงินต้นคงเหลือตามสัญญา</th>
                <th>สถานะหนี้</th>
                <th>ประเภทหลักประกัน</th>
                <th>วัตถุประสงค์การกู้ตามสัญญา</th>
                <th>ประเภทวัตถุประสงค์การกู้ตามสัญญา</th>
                <th>สถานะการตรวจสอบจำแนกมูลหนี้</th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index, selected[index]))) : (
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
      <div className="d-flex align-items-center justify-content-center my-3">
        <div className={`${isSome ? '' : 'd-none'}`}>
          <div className="d-flex">
            <button type="button" className="btn btn-success btn-sm ms-2" onClick={() => onSubmit()}>จัดทำรายชื่อเกษตรกร</button>
            {' '}
            <button type="button" className="btn btn-danger btn-sm ms-2" onClick={() => onRemove()}>ไม่จัดทำรายชื่อ</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default DebtRegisterSelectedTable;