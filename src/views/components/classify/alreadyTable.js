import { useEffect, useState } from "react";
import { toCurrency } from "@utils";
import { 
  getDebtManagementAlreadyClassify,
} from "@services/api";
const ClassifyAlreadyTable = (props) => {
  const { idcard, province, creditorType } = props;
  const [data, setData] = useState(null);
  const [sum_npl, setNpl] = useState(null);
  const [sum_npa, setNpa] = useState(null);
  const [total, setTotal] = useState(null);
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="align-middle">{index + 1}</td>
        <td>{item.checking_management_status}</td>
        <td>{item.contract_number}</td>
        <td>{item.debt_manage_contract_no}</td>
        <td>{toCurrency(item.debt_manage_outstanding_principal,2)}</td>
        <td>{item.creditor_type}</td>
        <td>{item.creditor_name}</td>
        <td>{toCurrency(item.frD_paymen_amount,2)}</td>
        <td>{item.debt_management_type}</td>
        <td>{item.dept_status}</td>
      </tr>
    ))
  }
  const fetchData = async() => {
    const result = await getDebtManagementAlreadyClassify(idcard, province, creditorType);
    if (result.isSuccess) {
      await setData(result.contracts)
      await setNpl(result.sum_npl)
      await setNpa(result.sum_npa)
      await setTotal(result.total)
    } else {
      await setData(null)
      await setNpl(0.00)
      await setNpa(0.00)
      await setTotal(0.00)
    }
  }
  useEffect(() => {
    fetchData();
  },[])
  return (
    <>
      <div id="tableExample" data-list='{"valueNames":["id","name","province"]}'>
        <div className="table-responsive mx-n1 px-1">
          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
              <tr>
                <th style={{ minWidth: 30 }}>#</th>
                <th>สถานะสัญญา</th>
                <th>เลขนิติกรรม</th>
                <th>เลขที่สัญญาทะเบียนหนี้</th>
                <th>เงินต้นคงเหลือตามสัญญาทะเบียนหนี้</th>
                <th>ประเภทเจ้าหนี้</th>
                <th>สถาบันเจ้าหนี้</th>
                <th>กฟก.ชำระเงินจำนวน</th>
                <th>ประเภทจัดการหนี้</th>
                <th>ประเภทสถานะบัญชีลูกหนี้ </th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={10}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <br />
      {(data && data.length > 0) &&(
        <h6>
          <div className="d-flex flex-column align-items-end gap-2">
            <div>ซื้อหนี้ไปแล้วทั้งหมด : {toCurrency(sum_npl,2)} บาท</div>
            <div>ซื้อทรัพย์ไปแล้วทั้งหมด : {toCurrency(sum_npa,2)} บาท</div>
            <div>ยอดคงเหลือที่สามารถซื้อได้ : {toCurrency(total,2)} บาท</div>
          </div>
        </h6>
      )}
    </>
  );
};
export default ClassifyAlreadyTable;