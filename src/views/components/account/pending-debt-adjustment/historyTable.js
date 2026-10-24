import Paging from "@views/components/Paging";
import { stringToDateTh, toCurrency } from "@utils";

const StatusBadge = (props) => {
  const { status } = props;
  if (status === 'ยืนยันแล้ว') {
    return (<span className="badge rounded-pill bg-success-subtle text-success-dark px-3 py-2"><span className="fas fa-check me-1"></span>ยืนยันการปรับปรุงหนี้แล้ว</span>);
  }
  if (status === 'ยกเลิก') {
    return (<span className="badge rounded-pill bg-danger-subtle text-danger px-3 py-2"><span className="fas fa-times me-1"></span>ยกเลิกการปรับปรุง</span>);
  }
  return (<span className="badge rounded-pill bg-warning-subtle text-warning-dark px-3 py-2">รอดำเนินการ</span>);
};

const HistoryTable = (props) => {
  const { result, filter, getData, onDownload } = props;
  const data = result?.data ?? [];
  return (
    <div>
      <div className="table-responsive">
        <table className="table table-sm table-striped table-bordered fs-9 mb-0">
          <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0', border: '#cdd0c7' }}>
            <tr>
              <th>ครั้งที่</th>
              <th>วันที่ดำเนินการ</th>
              <th>ผู้ดำเนินการ</th>
              <th>สถานะ</th>
              <th>วันที่ใบเสร็จรับเงิน</th>
              <th>จำนวนเงินตามใบเสร็จรับเงิน (บาท)</th>
              <th>จำนวนเงินที่ปรับปรุง (บาท)</th>
              <th>เอกสาร</th>
            </tr>
          </thead>
          <tbody className="text-center align-middle">
            {(data && data.length > 0) ? data.map((item, index) => (
              <tr key={index}>
                <td>{item.action_no}</td>
                <td>{item.action_date ? stringToDateTh(item.action_date, false) : '-'}</td>
                <td>{item.action_by}</td>
                <td><StatusBadge status={item.status} /></td>
                <td>{item.receipt_date ? stringToDateTh(item.receipt_date, false) : '-'}</td>
                <td className="text-end">{toCurrency(item.receipt_amount)}</td>
                <td className="text-end">{item.status === 'ยกเลิก' ? '-' : toCurrency(item.accounting_amount)}</td>
                <td>
                  <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => onDownload(item)}>
                    <span className="fas fa-download me-1"></span>ดาวน์โหลดเอกสาร
                  </button>
                </td>
              </tr>
            )) : (
              <tr>
                <td className="fs-9 text-center align-middle" colSpan={8}>
                  <div className="mt-3 mb-3 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      {result?.total > 0 && getData && (
        <Paging currentPage={result?.currentPage ?? 0} total={result?.total ?? 1} totalPage={result?.totalPage ?? 1}
          setPage={(page) => getData({ ...filter, currentPage: page })}
        />
      )}
    </div>
  );
};
export default HistoryTable;
