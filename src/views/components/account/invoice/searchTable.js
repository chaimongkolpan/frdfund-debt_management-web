import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
import { stringToDateTh, toCurrency } from "@utils";
const SearchTable = (props) => {
  const { result, filter, getData, handlePrint, handleShowDetail
  } = props;
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(null);
  const [isSome, setIsSome] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [selected, setSelected] = useState([]);
  const onPrint = () => {
    if (handlePrint) {
      const selectedData = data.filter((i, index) => selected[index]);
      // save session
      handlePrint(selectedData)
    }
  }
  const onChange = async (id) => {
    await setSelected((prev) => {
      prev[id] = !prev[id];
      return [...prev]
    })
  }
  const onHeaderChange = async (checked) => {
    await setSelected(result.data.map((item) => checked));// && item.invStatus != 'ปกติ'
  }
  const RenderData = (item, index, checked) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">
          <div className="form-check ms-2 mb-0 fs-8">
            {/* disabled={item.invStatus == 'ปกติ'} */}
            <input className="form-check-input" type="checkbox" checked={checked} onChange={() => onChange(index)} />
          </div>
        </td>
        <td>{item.k_idcard}</td>
        <td>{item.k_name_prefix}</td>
        <td>{(item.k_firstname ?? '') + ' ' + (item.k_lastname ?? '')}</td>
        <td>{item.loan_province}</td>
        <td>{item.loan_creditor_type}</td>
        <td>{item.loan_creditor_name}</td>
        <td>{item.loan_creditor_province}</td>
        <td>{item.loan_creditor_branch}</td>
        <td>{item.policyNO}</td>
        <td>{item.loan_debt_type}</td>
        <td>{item.policyStartDate ? stringToDateTh(item.policyStartDate, false) : '-'}</td>
        <td>{item.numberOfPeriodPayback}</td>
        <td>{item.numberOfYearPayback}</td>
        <td>{toCurrency(item.loan_amount)}</td>
        <td>{toCurrency(item.compensation_amount)}</td>
        <td>{item.policyStatus}</td>
        <td>{item.invStatus}</td>
        <td>{item.printInvStatus == 0 ? 'ยังไม่ได้ปริ้น' : 'ปริ้นแล้ว'}</td>
        <td>{stringToDateTh(item.printInvDate, false)}</td>
        <td className="align-middle white-space-nowrap text-center pe-0">
          <div className="btn-reveal-trigger position-static">
            <button className="btn btn-phoenix-secondary btn-sm dropdown-toggle dropdown-caret-none transition-none btn-reveal fs-10" type="button" data-bs-toggle="dropdown" data-boundary="window" aria-haspopup="true" aria-expanded="false" data-bs-reference="parent"><span className="fas fa-ellipsis-h fs-10"></span></button>
            <div className="dropdown-menu dropdown-menu-end py-2">
              <button className="dropdown-item" type="button" onClick={() => handleShowDetail(item)}>ประวัติใบแจ้งหนี้</button>
            </div>
          </div>
        </td>
      </tr>
    ))
  }
  const RenderAll = () => {
    return (data && data.length > 0) ? (data.map((item,index) => RenderData(item, index, selected[index] ?? false))) : (
      <tr>
        <td className="fs-9 text-center align-middle" colSpan={26}>
          <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
        </td>
      </tr>
    )
  }
  useEffect(() => {
    setIsSome(selected.some(i => i))
    setIsAll(selected.every(i => i) && selected.length > 0)
    RenderAll();
    return () => { console.log('Clear data.') }
  },[selected])
  useEffect(() => {
    if(result) {
      setData(result.data);
      setPaging({ currentPage: result.currentPage, total: result.total, totalPage: result.totalPage });
      setSelected(result.data.map(() => false))
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
                <th className="white-space-nowrap fs-9 align-middle ps-0" rowSpan="2">
                  <div className="form-check ms-2 me-0 mb-0 fs-8">
                    <input className={`form-check-input ${(isSome && !isAll && data.length > 0) ? 'some' : ''}`} type="checkbox" checked={isAll} onChange={() => onHeaderChange(!isAll)} />
                  </div>
                </th>
                <th colSpan="4">เกษตรกร</th>
                <th colSpan="4">เจ้าหนี้</th>
                <th colSpan="8">นิติกรรมสัญญา</th>
                <th colSpan="3">การออกใบแจ้งหนี้</th>
                <th rowSpan="2">ดำเนินการ</th>
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
                <th>เลขที่นิติกรรมสัญญา</th>
                <th>ประเภทจัดการหนี้</th>
                <th>วันที่ทำสัญญา</th>
                <th>จำนวนงวด</th>
                <th>จำนวนปี</th>
                <th>ยอดเงินตามสัญญา</th>
                <th>จำนวนเงินที่ชดเชย</th>
                <th>สถานะนิติกรรมสัญญา</th>
                <th>สถานะออกใบแจ้งหนี้</th>
                <th>สถานะการปริ้นใบแจ้งหนี้</th>
                <th>วันที่ปริ้นใบแจ้งหนี้</th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle" id="bulk-select-body">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index, selected[index] ?? false))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={20}>
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
      <div className="d-flex align-items-center justify-content-center my-3">
        <div className={`${isSome ? '' : 'd-none'}`}>
          <div className="d-flex">
            <button className="btn btn-primary btn-sm ms-2" type="button" onClick={() => onPrint()}>ปริ้นใบแจ้งหนี้และใบจ่าหน้าซอง</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default SearchTable;