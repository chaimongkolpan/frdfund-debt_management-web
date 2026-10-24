import { toCurrency } from "@utils";

const columns = [
  { key: 'row_no', label: 'ลำดับ' },
  { key: 'policyNO', label: 'เลขที่นิติกรรมสัญญา' },
  { key: 'k_idcard', label: 'เลขบัตรประชาชน' },
  { key: 'k_name_prefix', label: 'คำนำหน้า' },
  { key: 'k_firstname', label: 'ชื่อ' },
  { key: 'k_lastname', label: 'นามสกุล' },
  { key: 'statement_paid_date', label: 'วันที่รับชำระ Statement' },
  { key: 'statement_amount', label: 'จำนวนเงิน Statement', money: true },
  { key: 'bank_account_no', label: 'เลขที่บัญชีเงินฝากธนาคารที่รับชำระ' },
  { key: 'receipt_date', label: 'วันที่ใบเสร็จรับเงิน' },
  { key: 'receipt_no', label: 'เลขที่ใบเสร็จรับเงิน' },
  { key: 'receipt_amount', label: 'จำนวนเงินตามใบเสร็จรับเงิน', money: true },
  { key: 'accounting_doc_date', label: 'วันที่เอกสารทางบัญชี' },
  { key: 'accounting_doc_no', label: 'เลขที่เอกสารทางบัญชี (วันที่ล้างสะสาง)' },
  { key: 'accounting_amount', label: 'จำนวนเงินตามเอกสารบัญชี', money: true },
];

const ValidationTable = (props) => {
  const { result, onDownloadResult, onDownloadDocuments } = props;
  if (!result) return null;
  const rows = result.Data ?? [];
  return (
    <div className="border rounded-2 overflow-hidden">
      <div className="p-3 bg-success-dark text-white">
        <div className="fw-bold">ผลการตรวจสอบข้อมูลนำเข้า</div>
        <div className="fs-9">ไฟล์: &quot;{result.import_filename}&quot;</div>
      </div>
      <div className="d-flex flex-wrap gap-2 align-items-center p-3 bg-light border-bottom">
        <span className="badge bg-secondary-subtle text-secondary-emphasis">ทั้งหมด {result.total_items} บรรทัด</span>
        {result.all_valid ? (
          <span className="badge bg-success-subtle text-success-dark"><span className="fas fa-check me-1"></span>ข้อมูลถูกต้องครบทุกบรรทัด</span>
        ) : (
          <>
            <span className="badge bg-success-subtle text-success-dark">ถูกต้อง {result.total_valid} บรรทัด</span>
            <span className="badge bg-danger-subtle text-danger">ไม่ถูกต้อง {result.total_invalid} บรรทัด</span>
          </>
        )}
      </div>
      <div className="table-responsive">
        <table className="table table-sm table-bordered fs-9 mb-0">
          <thead className="align-middle text-center text-nowrap table-light">
            <tr>
              {columns.map((c) => (<th key={c.key}>{c.label}</th>))}
              <th style={{ minWidth: 220 }}>ผลการตรวจสอบ</th>
            </tr>
          </thead>
          <tbody className="text-center align-middle">
            {rows.map((row, index) => (
              <tr key={index} className={!row.is_valid ? 'table-warning' : ''}>
                {columns.map((c) => (
                  <td key={c.key} className={c.money ? 'text-end' : ''}>
                    {c.money ? toCurrency(row[c.key]) : (row[c.key] ?? '-')}
                  </td>
                ))}
                <td className="text-start">
                  {row.is_valid ? (
                    <span className="text-success fw-bold"><span className="fas fa-check me-1"></span>ข้อมูลถูกต้อง</span>
                  ) : (
                    <span className="text-danger fw-bold">{row.validation_result}</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="d-flex justify-content-between align-items-center flex-wrap gap-2 p-3 bg-light border-top">
        {result.all_valid ? (
          <>
            <div className="fs-9">
              จำนวนรายการ <b>{result.total_items} รายการ</b>
              <span className="text-muted mx-2">|</span>
              ผลรวมจำนวนเงิน (ตามใบเสร็จรับเงิน) <b className="text-success-dark">{toCurrency(result.total_amount)} บาท</b>
            </div>
            <button className="btn btn-success" type="button" onClick={() => onDownloadDocuments(result)}>
              <span className="fas fa-download me-1"></span>ดาวน์โหลดเอกสารการคำนวณ
            </button>
          </>
        ) : (
          <div className="w-100 text-end">
            <button className="btn btn-outline-primary" type="button" onClick={() => onDownloadResult(result)}>
              <span className="fas fa-download me-1"></span>ดาวน์โหลดผลการตรวจสอบ
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default ValidationTable;
