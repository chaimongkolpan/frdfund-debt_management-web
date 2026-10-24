import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
import { stringToDateTh, toCurrency } from "@utils";
const SearchTable = (props) => {
  const { result, filter, getData, handleDownload, handleViewDetail, handleConfirm, handleCancel
  } = props;
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(null);
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">{index + 1}</td>
        <td>{item.imported_at ? stringToDateTh(item.imported_at, false) : '-'}</td>
        <td className="text-start">{item.import_filename}</td>
        <td>{item.imported_by}</td>
        <td>{item.total_items} รายการ</td>
        <td className="text-end">{toCurrency(item.total_amount)}</td>
        <td className="align-middle white-space-nowrap text-center">
          <div className="d-flex flex-wrap gap-1 justify-content-center">
            <button className="btn btn-outline-primary btn-sm" type="button" onClick={() => handleDownload(item)}>
              <span className="fas fa-download me-1"></span>ดาวน์โหลดเอกสาร
            </button>
            <button className="btn btn-sm text-white" style={{ backgroundColor: '#5A4FFF' }} type="button" onClick={() => handleViewDetail(item)}>
              <span className="fas fa-eye me-1"></span>ดูรายละเอียดข้อมูล
            </button>
            <button className="btn btn-success btn-sm" type="button" onClick={() => handleConfirm(item)}>
              <span className="fas fa-check me-1"></span>ยืนยันการปรับปรุงหนี้รอสะสาง
            </button>
            <button className="btn btn-outline-danger btn-sm" type="button" onClick={() => handleCancel(item)}>
              <span className="fas fa-times me-1"></span>ยกเลิกการปรับปรุง
            </button>
          </div>
        </td>
      </tr>
    ))
  }
  useEffect(() => {
    if(result) {
      setData(result.data);
      setPaging({ currentPage: result.currentPage, total: result.total, totalPage: result.totalPage });
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
                <th className="white-space-nowrap fs-9 align-middle ps-0" style={{ minWidth: 30 }}>ลำดับ</th>
                <th>วันที่นำเข้าข้อมูล</th>
                <th>ชื่อไฟล์นำเข้า</th>
                <th>ผู้นำเข้าข้อมูล</th>
                <th>จำนวนรายการ</th>
                <th>ผลรวมจำนวนเงิน (บาท)</th>
                <th>การดำเนินการ</th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle" id="bulk-select-body">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={7}>
                    <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {paging?.total > 0 && (
          <Paging currentPage={paging?.currentPage ?? 0} total={paging?.total ?? 1} totalPage={paging?.totalPage ?? 1}
            setPage={(page) => getData({ ...filter, currentPage: page })}
          />
        )}
      </div>
    </>
  );
};
export default SearchTable;
