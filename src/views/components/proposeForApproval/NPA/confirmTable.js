import { toCurrency } from "@utils";
const ConfirmTable = (props) => {
  const { data } = props;

  const RenderData = (item, index) => {
    return (
      item && (
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
          <td>{item.npA_round}</td>
          <td>{item.title_document_no}</td>
          <td>{item.debt_manage_contract_no}</td>
          <td>{toCurrency(item.estimated_price_creditors)}</td>
          <td>{toCurrency(item.npA_property_sales_price)}</td>
          <td>{toCurrency(item.npL_creditors_receive)}</td>
          <td>{toCurrency(item.litigation_expenses)}</td>
          <td>{toCurrency(item.insurance_premium)}</td>
          <td>{toCurrency(item.total_xpenses)}</td>
          <td>{toCurrency(item.frD_total_payment)}</td>
          <td>{item.debt_manage_status}</td>
          <td>{item.collateral_type}</td>
          <td>{item.debt_manage_objective}</td>
          <td>{item.regulation_no}</td>
        </tr>
      )
    );
  };
  
  return (
    <>
      <div id="tableExample" data-list='{"valueNames":["name","email","age"]}'>
        <div className="table-responsive mx-n1 px-1">
          <table className="table table-sm table-striped table-bordered fs-9 mb-0">
            <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: "#d9fbd0", border: "#cdd0c7" }}>
              <tr>
                <th rowSpan="2" style={{ minWidth: 30 }}>#</th>
                <th colSpan="4">เกษตรกร</th>
                <th colSpan="4">เจ้าหนี้</th>
                <th colSpan="14">สัญญา</th>
              </tr>
              <tr>
                <th>เลขบัตรประชาชน</th>
                <th>คำนำหน้า</th>
                <th style={{ minWidth: 150 }}>ชื่อ-นามสกุล</th>
                <th>จังหวัด</th>
                <th style={{ minWidth: 150 }}>ประเภทเจ้าหนี้</th>
                <th style={{ minWidth: 180 }}>สถาบันเจ้าหนี้</th>
                <th>จังหวัดเจ้าหนี้</th>
                <th>สาขาเจ้าหนี้</th>
                <th>รอบ NPA</th>
                <th>เอกสารสิทธิ์</th>
                <th>เลขที่สัญญา</th>
                <th>ราคาประเมินของเจ้าหนี้</th>
                <th>ราคาขายทรัพย์ NPA</th>
                <th>เจ้าหนี้รับชำระต้นเงินคงเหลือ (NPL)</th>
                <th>ค่าใช้จ่ายในการดำเนินคดี</th>
                <th>ค่าเบี้ยประกัน</th>
                <th>รวมค่าใช้จ่าย</th>
                <th>รวมทั้งสิ้น</th>
                <th>สถานะหนี้</th>
                <th>ประเภทหลักประกัน</th>
                <th>วัตถุประสงค์การกู้</th>
                <th>ซื้อทรัพย์ตามระเบียบฯ</th>
              </tr>
            </thead>
            <tbody className="list text-center">
              {data && data.length > 0 ? (
                data.map((item, index) => RenderData(item, index))
              ) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={23}>
                    <div className="mt-5 mb-5 fs-8">
                      <h5>ไม่มีข้อมูล</h5>
                    </div>
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
export default ConfirmTable;
