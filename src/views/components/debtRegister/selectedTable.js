import { useEffect, useState } from "react";
const DebtRegisterSelectedTable = (props) => {
  const { result, handleSubmit, handleRemove, filter, getData } = props;
  const [data, setData] = useState([]);
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
    if (handleSubmit) {
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
        <td className="align-middle">{item.id_card}</td>
        <td className="align-middle">{item.name_prefix}</td>
        <td className="align-middle">{(item.firstname ?? '') + ' ' + (item.lastname ?? '')}</td>
        <td className="align-middle">{item.province}</td>
        <td className="align-middle">{item.organization_name}</td>
        <td className="align-middle">{item.organization_no}</td>
        <td className="align-middle">{item.organization_register_round}</td>
        <td className="align-middle">{item.organization_status}</td>
        <td className="align-middle">{item.date_member_first_time}</td>
        <td className="align-middle">{item.debt_register_status}</td>
        <td className="align-middle">{item.debt_register_round}</td>
        <td className="align-middle">{item.date_submit_debt_register}</td>
        <td className="align-middle">{item.passed_approval_no}</td>
        <td className="align-middle">{item.passed_approval_date}</td>
        <td className="align-middle">{item.creditor_type}</td>
        <td className="align-middle">{item.creditor_name}</td>
        <td className="align-middle">{item.creditor_province}</td>
        <td className="align-middle">{item.creditor_branch}</td>
        <td className="align-middle">{item.contract_no}</td>
        <td className="align-middle">{item.remaining_principal_contract}</td>
        <td className="align-middle">{item.dept_status}</td>
        <td className="align-middle">{item.collateral_type}</td>
        <td className="align-middle">{item.purpose_loan_contract}</td>
        <td className="align-middle">{item.purpose_type_loan_contract}</td>
        <td className="align-middle">{item.status}</td>
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
                <th className="text-center" colSpan="4">เกษตรกร</th>
                <th className="text-center" colSpan="5">องค์กร</th>
                <th className="text-center" colSpan="5">ทะเบียนหนี้</th>
                <th className="text-center" colSpan="4">เจ้าหนี้</th>
                <th className="text-center" colSpan="7">สัญญา</th>
              </tr>
              <tr>
                <th className="align-middle text-center" data-sort="name">เลขบัตรประชาชน</th>
                <th className="align-middle text-center" data-sort="email">คำนำหน้า</th>
                <th className="align-middle text-center" data-sort="age">ชื่อ-นามสกุล</th>
                <th className="align-middle text-center" data-sort="age">จังหวัด</th>
                <th className="align-middle text-center" data-sort="age">ชื่อองค์กรการเกษตร</th>
                <th className="align-middle text-center" data-sort="age">หมายเลของค์กร</th>
                <th className="align-middle text-center" data-sort="age">รอบองค์กร</th>
                <th className="align-middle text-center" data-sort="age">สถานะองค์กร</th>
                <th className="align-middle text-center" data-sort="email">วันที่เป็นสมาชิก (ครั้งแรก)</th>
                <th className="align-middle text-center" data-sort="age">สถานะการตรวจสอบทะเบียนหนี้</th>
                <th className="align-middle text-center" data-sort="age">รอบหนี้</th>
                <th className="align-middle text-center" data-sort="age">วันที่ยื่นขึ้นทะเบียนหนี้</th>
                <th className="align-middle text-center" data-sort="age">ผ่านความเห็นชอบครั้งที่</th>
                <th className="align-middle text-center" data-sort="age">ผ่านความเห็นชอบวันที่</th>
                <th className="align-middle text-center" data-sort="age">ประเภทเจ้าหนี้</th>
                <th className="align-middle text-center" data-sort="age">สถาบันเจ้าหนี้</th>
                <th className="align-middle text-center" data-sort="age">จังหวัดเจ้าหนี้</th>
                <th className="align-middle text-center" data-sort="age">สาขาเจ้าหนี้</th>
                <th className="align-middle text-center" data-sort="age">เลขที่สัญญา</th>
                <th className="align-middle text-center" data-sort="age">เงินต้นตามสัญญา</th>
                <th className="align-middle text-center" data-sort="age">สถานะหนี้</th>
                <th className="align-middle text-center" data-sort="age">ประเภทหลักประกัน</th>
                <th className="align-middle text-center" data-sort="age">วัตถุประสงค์การกู้ตามสัญญา</th>
                <th className="align-middle text-center" data-sort="age">ประเภทวัตถุประสงค์การกู้ตามสัญญา</th>
                <th className="align-middle text-center" data-sort="age">สถานะการตรวจสอบจัดการหนี้</th>
              </tr>
            </thead>
            <tbody className="list text-center" id="bulk-select-body2">
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
        {/* <div className="d-flex justify-content-between mt-3"><span className="d-none d-sm-inline-block" data-list-info="data-list-info"></span>
          <div className="d-flex">
            <button className="page-link" data-list-pagination="prev"><span className="fas fa-chevron-left"></span></button>
            <ul className="mb-0 pagination"></ul>
            <button className="page-link pe-0" data-list-pagination="next"><span className="fas fa-chevron-right"></span></button>
          </div>
        </div> */}
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