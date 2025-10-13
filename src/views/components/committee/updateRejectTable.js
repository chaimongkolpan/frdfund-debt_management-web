import { useEffect, useState } from "react";
import { toCurrency, getBookNo } from "@utils";
import Remark from "@views/components/input/BookNo";
const DataTable = (props) => {
  const { result,remark, setRemark } = props;
  const [data, setData] = useState([]);
  const [coop, setCoop] = useState(true);
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td>{index + 1}</td>
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
        <td>{item.debt_manage_objective_details}</td>
        <td>{item.debt_manage_status}</td>
        <td>{item.collateral_type}</td>
        <td>{item.collateral_no}</td>
      </tr>
    ))
  }
  useEffect(() => {
    if(result) {
      setData(result);
      setCoop(result && result[0]?.debt_manage_creditor_type == 'สหกรณ์')
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
                <th rowspan="2" style={{ minWidth: 30 }}>#</th>
                <th colspan="4">เกษตรกร</th>
                <th colspan="4">เจ้าหนี้</th>
                <th colSpan={coop ? "11" : "13"}>สัญญา</th>
                <th colSpan="3">หลักทรัพย์ค้ำประกัน</th>
              </tr>
              <tr>
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
                <th>วัตถุประสงค์การกู้</th>
                <th>สถานะหนี้</th>
                <th>ประเภทหลักประกัน</th>
                <th>ประเภทและเลขที่หลักทรัพย์(เลขโฉนด)</th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle" id="bulk-select-body">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={coop ? 21 : 23}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <div className="d-flex align-items-center justify-content-center my-3">
        <Remark
          value={remark}
          title={'หมายเหตุ'}
          subtitle={'กฟก.'+ getBookNo() }
          containerClassname={''}
          handleChange={setRemark}
        />
      </div>
    </>
  );
};
export default DataTable;