import { useEffect, useState } from "react";
import { stringToDateTh } from "@utils";
const ClassifyImportTable = (props) => {
  const { data } = props;
  const [isMounted, setIsMounted] = useState(false);
  
  async function fetchData() {
    await setTimeout(() => {}, 1000);
    await setIsMounted(true);
  }

  //** ComponentDidMount
  useEffect(() => {
    fetchData();
    return () => console.log('Clear data')
  }, []);
  useEffect(() => {
    if (isMounted) {
      $('<script src="/assets/js/config.js"></script>').appendTo('body');
      $('<script src="/assets/js/phoenix.js"></script>').appendTo('body');
    }
    return () => {}
  }, [isMounted])
  if (!isMounted) {
    return null
  }
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="align-middle">{item.id_card}</td>
        <td className="align-middle">{item.name_prefix}</td>
        <td className="align-middle">{(item.firstname ?? '') + ' ' + (item.lastname ?? '')}</td>
        <td className="align-middle">{item.province}</td>
        <td className="align-middle">{item.organization_name}</td>
        <td className="align-middle">{item.organization_no}</td>
        <td className="align-middle">{item.organization_register_round}</td>
        <td className="align-middle">{item.organization_status}</td>
        <td className="align-middle">{item.date_member_first_time ? stringToDateTh(item.date_member_first_time, false) : '-'}</td>
        <td className="align-middle">{item.debt_register_status}</td>
        <td className="align-middle">{item.debt_register_round}</td>
        <td className="align-middle">{item.date_member_current ? stringToDateTh(item.date_member_current, false) : '-'}</td>
        <td className="align-middle">{item.passed_approval_no}</td>
        <td className="align-middle">{item.passed_approval_date ? stringToDateTh(item.passed_approval_date, false) : '-'}</td>
        <td className="align-middle">{item.creditor_type}</td>
        <td className="align-middle">{item.creditor_name}</td>
        <td className="align-middle">{item.creditor_province}</td>
        <td className="align-middle">{item.creditor_branch}</td>
        <td className="align-middle">{item.debt_manage_contract_no}</td>
        <td className="align-middle">{item.debt_manage_outstanding_principal}</td>
        <td className="align-middle">{item.dept_status}</td>
        <td className="align-middle">{item.collateral_type}</td>
        <td className="align-middle">{item.purpose_loan_contract}</td>
        <td className="align-middle">{item.purpose_type_loan_contract}</td>
        <td className="align-middle">{item.checking_management_status}</td>
      </tr>
    ))
  }
  return (
    <>
      {/* start ตารางเลือกสัญญาNPL*/}
      <div id="tableExample" data-list='{"valueNames":["name","email","age"]}'>
        <div className="table-responsive mx-n1 px-1">
          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
              <tr>
                <th className="text-center" colSpan="4">เกษตรกร</th>
                <th className="text-center" colSpan="5">องค์กร</th>
                <th className="text-center" colSpan="5">ทะเบียนหนี้</th>
                <th className="text-center" colSpan="4">เจ้าหนี้</th>
                <th className="text-center" colSpan="7">สัญญา</th>
              </tr>
              <tr>
                <th className="align-middle text-center">เลขบัตรประชาชน</th>
                <th className="align-middle text-center">คำนำหน้า</th>
                <th className="align-middle text-center">ชื่อ-นามสกุล</th>
                <th className="align-middle text-center">จังหวัด</th>
                <th className="align-middle text-center">ชื่อองค์กรการเกษตร</th>
                <th className="align-middle text-center">หมายเลของค์กร</th>
                <th className="align-middle text-center">รอบองค์กร</th>
                <th className="align-middle text-center">สถานะองค์กร</th>
                <th className="align-middle text-center">วันที่เป็นสมาชิก (ครั้งแรก)</th>
                <th className="align-middle text-center">สถานะการตรวจสอบทะเบียนหนี้</th>
                <th className="align-middle text-center">รอบหนี้</th>
                <th className="align-middle text-center">วันที่ยื่นขึ้นทะเบียนหนี้</th>
                <th className="align-middle text-center">ผ่านความเห็นชอบครั้งที่</th>
                <th className="align-middle text-center">ผ่านความเห็นชอบวันที่</th>
                <th className="align-middle text-center">ประเภทเจ้าหนี้</th>
                <th className="align-middle text-center">สถาบันเจ้าหนี้</th>
                <th className="align-middle text-center">จังหวัดเจ้าหนี้</th>
                <th className="align-middle text-center">สาขาเจ้าหนี้</th>
                <th className="align-middle text-center">เลขที่สัญญา</th>
                <th className="align-middle text-center">เงินต้นตามสัญญา</th>
                <th className="align-middle text-center">สถานะหนี้</th>
                <th className="align-middle text-center">ประเภทหลักประกัน</th>
                <th className="align-middle text-center">วัตถุประสงค์การกู้ตามสัญญา</th>
                <th className="align-middle text-center">ประเภทวัตถุประสงค์การกู้ตามสัญญา</th>
                <th className="align-middle text-center">สถานะการตรวจสอบจัดการหนี้</th>
              </tr>
            </thead>
            <tbody className="list text-center" id="bulk-select-body">
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
      {/* end ตารางเลือกสัญญาNPL*/}
    </>
  );
};
export default ClassifyImportTable;