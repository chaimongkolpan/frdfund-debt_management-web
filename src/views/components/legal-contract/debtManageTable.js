import { useEffect, useState } from "react";
import { toCurrency } from "@utils";
const ClassifyDebtManageTable = (props) => {
  const { data } = props;
  const [debt_management_type, setDebtType] = useState(null);
  const [creditor_type, setCreditorType] = useState(null);
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        {debt_management_type == 'NPA' && (
          <>
            <td>{item.npA_round}</td>
            <td>{item.title_document_no}</td>
          </>
        )}
        <td>{item.debt_manage_contract_no}</td>
        {debt_management_type == 'NPA' ? (
          <>
            <td>{toCurrency(item.estimated_price_creditors)}</td>
            <td>{toCurrency(item.npA_property_sales_price)}</td>
            <td>{toCurrency(item.npL_creditors_receive)}</td>
            <td>{toCurrency(item.litigation_expenses)}</td>
            <td>{toCurrency(item.insurance_premium)}</td>
            <td>{toCurrency(item.total_xpenses)}</td>
            <td>{toCurrency(item.frD_total_payment)}</td>
          </>
        ) : (
          <>
            <td>{toCurrency(item.debt_manage_outstanding_principal)}</td>
            <td>{toCurrency(item.debt_manage_accrued_interest)}</td>
            <td>{toCurrency(item.debt_manage_fine)}</td>
            <td>{toCurrency(item.debt_manage_litigation_expenses)}</td>
            <td>{toCurrency(item.debt_manage_forfeiture_withdrawal_fee)}</td>
            {creditor_type != 'สหกรณ์' && (
              <>
                <td>{toCurrency(item.debt_manage_insurance_premium)}</td>
                <td>{toCurrency(item.debt_manage_other_expenses)}</td>
              </>
            )}
            <td>{toCurrency(item.debt_manage_total_expenses)}</td>
            <td>{toCurrency(item.debt_manage_total)}</td>
          </>
        )}
        <td>{item.debt_manage_status}</td>
        {debt_management_type == 'NPA' && ( 
          <td>{item.regulation_no}</td>
        )} 
      </tr>
    ))
  }
  useEffect(() => {
    if (data  && data?.length > 0) {
      setDebtType(data[0].debt_management_type)
      setCreditorType(data[0].debt_manage_creditor_type)
    }
  },[data])
  return (
    <>
      <div id="tableExample" data-list='{"valueNames":["id","name","province"]}'>
        <div className="table-responsive mx-n1 px-1">
          <table className="table table-sm table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
              <tr>
                {debt_management_type == 'NPA' && (
                  <>
                    <th>รอบ NPA</th>
                    <th>เอกสารสิทธิ์</th>
                  </>
                )}
                <th>เลขที่สัญญา</th>
                {debt_management_type == 'NPA' ? (
                  <>
                    <th>ราคาประเมินของเจ้าหนี้</th>
                    <th>ราคาขายทรัพย์ NPA</th>
                    <th>เจ้าหนี้รับชำระต้นเงินคงเหลือ (NPL)</th>
                    <th>ค่าใช้จ่ายในการดำเนินคดี</th>
                    <th>ค่าเบี้ยประกัน</th>
                    <th>รวมค่าใช้จ่าย</th>
                    <th>รวมทั้งสิ้น</th>
                  </>
                ) : (
                  <>
                    <th>เงินต้น</th>
                    <th>ดอกเบี้ย</th>
                    <th>ค่าปรับ</th>
                    <th>ค่าใช้จ่ายในการดำเนินคดี</th>
                    <th>ค่าถอนการยึดทรัพย์</th>
                    {creditor_type != 'สหกรณ์' && (
                      <>
                        <th>ค่าเบี้ยประกัน</th>
                        <th>ค่าใช้จ่ายอื่นๆ</th>
                      </>
                    )}
                    <th>รวมค่าใช้จ่าย</th>
                    <th>รวมทั้งสิ้น</th>
                  </>
                )}
                <th>สถานะหนี้</th>
                {debt_management_type == 'NPA' && (
                  <th>ซื้อทรัพย์ตามระเบียบฯ</th>  
                )} 
              </tr>
            </thead>
            <tbody className="list text-center align-middle">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={14}>
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
export default ClassifyDebtManageTable;