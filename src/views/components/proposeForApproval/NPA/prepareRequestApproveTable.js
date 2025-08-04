import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
import { stringToDateTh, toCurrency } from "@utils";
const SearchTable = (props) => {
  const { result, handleSubmit, filter, getData } = props;
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(null);
  const [isSome, setIsSome] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [selected, setSelected] = useState([]);
  const onSubmit = () => {
    if (handleSubmit) {
      const selectedData = data.filter((i, index) => selected[index]);
      handleSubmit(selectedData)
    }
  }
  const onChange = async (id) => {
    await setSelected((prev) => {
      prev[id] = !prev[id];
      return [...prev]
    })
  }
  const onHeaderChange = async (checked) => {
    await setSelected(result.data.map(() => checked));
    await setIsAll(checked)
  }
  const RenderData = (item, index, checked) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">
          <div className="form-check ms-2 mb-0 fs-8">
            <input className="form-check-input" type="checkbox" checked={checked} onChange={() => onChange(index)} />
          </div>
        </td>
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
    ))
  }
  const RenderAll = () => {
    return (data && data.length > 0) ? (data.map((item,index) => RenderData(item, index, selected[index] ?? false))) : (
      <tr>
        <td className="fs-9 text-center align-middle" colSpan={23}>
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
      setSelected(result.data.map(() => false));
      setPaging({ currentPage: result.currentPage, total: result.total, totalPage: result.totalPage })
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
                <th colspan="4">เกษตรกร</th>
                <th colspan="4">เจ้าหนี้</th>
                <th colspan="14">สัญญา</th>
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
            <tbody className="list text-center align-middle" id="bulk-select-body">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index, selected[index]))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={23}>
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
            <button className="btn btn-subtle-success btn-sm ms-2" type="button" onClick={() => onSubmit()}>เลือกสัญญาขออนุมัติรายชื่อ</button>
          </div>
        </div>
      </div>
    </>
  );
};
export default SearchTable;