const DebtRegisterConfirmTable = (props) => {
  const { data } = props;
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="align-middle text-center">{index + 1}</td>
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
  return (
    <>
      <div id="tableExample" data-list='{"valueNames":["name","email","age"]}'>
        <div className="table-responsive mx-n1 px-1">
          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
              <tr>
                <th className="text-center" rowSpan="2" style={{ minWidth: 40 }}>#</th>
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
            <tbody className="list text-center">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={26}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
};
export default DebtRegisterConfirmTable;