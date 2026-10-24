import { toCurrency } from "@utils";

const DetailTable = (props) => {
  const { batch, onHistory } = props;
  if (!batch) return null;
  const items = batch.Items ?? [];
  return (
    <>
      <div className="row g-3 mb-3">
        <div className="col-sm-6"><b>ไฟล์นำเข้า:</b> {batch.import_filename}</div>
        <div className="col-sm-3"><b>จำนวนรายการ:</b> {batch.total_items} รายการ</div>
        <div className="col-sm-3"><b>ผลรวมจำนวนเงิน:</b> {toCurrency(batch.total_amount)} บาท</div>
      </div>
      <div className="table-responsive">
        <table className="table table-sm table-bordered fs-9 mb-0">
          <thead className="align-middle text-center text-nowrap table-light">
            <tr>
              <th>ลำดับ</th>
              <th>เลขที่นิติกรรมสัญญา</th>
              <th>เลขบัตรประชาชน</th>
              <th>ชื่อ-นามสกุล</th>
              <th>วันที่รับชำระ Statement</th>
              <th>จำนวนเงิน Statement</th>
              <th>วันที่ใบเสร็จรับเงิน</th>
              <th>เลขที่ใบเสร็จรับเงิน</th>
              <th>จำนวนเงินตามใบเสร็จรับเงิน</th>
              <th>ประวัติ</th>
            </tr>
          </thead>
          <tbody className="text-center align-middle">
            {(items && items.length > 0) ? items.map((item, index) => (
              <tr key={index}>
                <td>{item.row_no ?? index + 1}</td>
                <td>{item.policyNO}</td>
                <td>{item.k_idcard}</td>
                <td>{(item.k_name_prefix ?? '') + (item.k_firstname ?? '') + ' ' + (item.k_lastname ?? '')}</td>
                <td>{item.statement_paid_date}</td>
                <td className="text-end">{toCurrency(item.statement_amount)}</td>
                <td>{item.receipt_date}</td>
                <td>{item.receipt_no}</td>
                <td className="text-end">{toCurrency(item.receipt_amount)}</td>
                <td>
                  <button className="btn btn-outline-secondary btn-sm" type="button" onClick={() => onHistory(item)}>
                    <span className="fas fa-history me-1"></span>ประวัติ
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td className="fs-9 text-center align-middle" colSpan={10}>
                  <div className="mt-3 mb-3 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
};
export default DetailTable;
