import { useEffect, useState } from "react";
import Paging from "@views/components/Paging";
import { stringToDateTh, toCurrency, getBookNo } from "@utils";
import DatePicker from "@views/components/input/DatePicker";
import BookNo from "@views/components/input/BookNo";
import EditDetail from "@views/components/confirm-committee/editDetailNpa";
import CustomerModal from "@views/components/modal/customModal";
import { 
  updateConfirmCommitteeCreditor,
  updateConfirmCommitteeNo,
} from "@services/api";

const SearchTable = (props) => {
  const { result, handleSubmit, filter, getData, can_action } = props;
  const [data, setData] = useState([]);
  const [paging, setPaging] = useState(null);
  const [isSome, setIsSome] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [selected, setSelected] = useState([]);
  const [editData, setEditData] = useState(null);
  const [isOpenDetail, setOpenDetail] = useState(false);
  const [isOpenCreditor, setOpenCreditor] = useState(false);
  const [isOpenCommittee, setOpenCommittee] = useState(false);
  const [count, setCount] = useState(0);
  const [contracts, setContracts] = useState(0);
  const [sumTotal, setSumTotal] = useState(0);
  const [creditorNo, setCreditorNo] = useState(null);
  const [creditorDate, setCreditorDate] = useState(null);
  const [committeeNo, setCommitteeNo] = useState(null);
  const [committeeDate, setCommitteeDate] = useState(null);
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
    await setSelected(result.data.map((x) => x.status_confirm == "แก้ไขยืนยันยอด" ? checked : false));
    await setIsAll(checked)
  }
  const handleShowDetail = async (item) => {
    await setEditData(item);
    await setOpenDetail(true);
  }
  const handleCloseDetail = async() => {
    await getData(filter);
    await setOpenDetail(false);
  }
  const handleShowCreditor = async() => {
    const selectedData = data.filter((i, index) => selected[index]);
    const custs = selectedData.reduce((prev, item) => { return prev.includes(item.id_card) ? prev : [ ...prev, item.id_card ]; }, []);
    const sum = selectedData.reduce((prev, item) => { return prev + (item.frD_total_payment_cf ?? item.frD_total_payment); }, 0)
    await setCount(toCurrency(custs.length));
    await setContracts(toCurrency(selectedData.length));
    await setSumTotal(toCurrency(sum,2));
    await setOpenCreditor(true);
  }
  const handleCloseCreditor = async() => {
    await getData(filter);
    await setOpenCreditor(false);
  }
  const handleShowCommittee = async() => {
    const selectedData = data.filter((i, index) => selected[index]);
    const custs = selectedData.reduce((prev, item) => { return prev.includes(item.id_card) ? prev : [ ...prev, item.id_card ]; }, []);
    const sum = selectedData.reduce((prev, item) => { return prev + (item.frD_total_payment_cf ?? item.frD_total_payment); }, 0)
    await setCount(toCurrency(custs.length));
    await setContracts(toCurrency(selectedData.length));
    await setSumTotal(toCurrency(sum,2));
    await setOpenCommittee(true);
  }
  const handleCloseCommittee = async() => {
    await getData(filter);
    await setOpenCommittee(false);
  }
  const submitCreditor = async() => {
    const selectedData = data.filter((i, index) => selected[index]);
    const ids = selectedData.map(item => item.id_debt_confirm.toString());
    const result = await updateConfirmCommitteeCreditor({
      ids, creditor_confirm_no: 'กฟก '+ getBookNo()  + creditorNo, creditor_confirm_date: stringToDateTh(creditorDate, false)
    });
    if (result.isSuccess) {
      await getData(filter);
      await setOpenCreditor(false);
    }
  }
  const submitCommittee = async() => {
    const selectedData = data.filter((i, index) => selected[index]);
    const ids = selectedData.map(item => item.id_debt_confirm.toString());
    const result = await updateConfirmCommitteeNo({
      ids, debt_manage_type: 'NPA', proposal_committee_no: committeeNo, proposal_committee_date: stringToDateTh(committeeDate, false)
    });
    if (result.isSuccess) {
      await getData(filter);
      await setOpenCommittee(false);
    }
  }
  const RenderData = (item, index, checked) => {
    return (item && (
      <tr key={index} style={{ backgroundColor: `${item.status_confirm == "แก้ไขยืนยันยอด" ? "#fdeae7" : "#ffffff" }`  }}>
        <td className="fs-9 align-middle">
          {can_action ? (
            <div className="form-check ms-2 mb-0 fs-8">
              <input className="form-check-input" type="checkbox" checked={checked} disabled={item.status_confirm != "แก้ไขยืนยันยอด"} onChange={() => onChange(index)} />
            </div>
          ) : (((paging?.currentPage - 1) * process.env.VITE_PAGESIZE) + index + 1)}
        </td>
        <td>
          <div className="d-flex justify-content-center"> 
            <button className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" disabled={!can_action} onClick={() => handleShowDetail(item)}><i className="far fa-edit "></i></button>
          </div>
        </td>
        <td>{item.proposal_committee_no}</td>
        <td>{item.proposal_committee_date}</td>
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
        <td>{item.debt_manage_objective}</td>
        <td>{item.debt_manage_objective_details}</td>
        <td>{item.regulation_no}</td>
        <td>{item.collateral_type}</td>
        {item.status_confirm == "แก้ไขยืนยันยอด" ? (
          <>
            <td>{toCurrency(item.npA_property_sales_price_cf)}</td>
            <td>{toCurrency(item.npL_creditors_receive_cf)}</td>
            <td>{toCurrency(item.litigation_expenses_cf)}</td>
            <td>{toCurrency(item.insurance_premium_cf)}</td>
            <td>{toCurrency(item.total_xpenses_cf)}</td>
            <td>{toCurrency(item.frD_total_payment_cf)}</td>
            <td>{item.debt_manage_status_cf}</td>
            <td>{item.status_confirm}</td>
            <td>{item.results_confirm}</td>
          </>
        ) : (
          <>
            <td></td><td></td><td></td><td></td><td></td><td></td>
            <td></td><td></td><td></td>
          </>
        )}
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
                <th className="white-space-nowrap fs-9 align-middle ps-0" rowSpan="2" style={{ minWidth: 30 }}>
                  {can_action ? (
                    <div className="form-check ms-2 me-0 mb-0 fs-8">
                      <input className={`form-check-input ${(isSome && !isAll && data.length > 0) ? 'some' : ''}`} type="checkbox" checked={isAll} onChange={() => onHeaderChange(!isAll)} />
                    </div>
                  ) : '#'}
                </th>
                <th rowSpan="2">ดำเนินการ</th>
                <th colSpan="2">คณะกรรมการจัดการหนี้</th>
                <th colSpan="4">เกษตรกร</th>
                <th colSpan="4">เจ้าหนี้</th>
                <th colSpan={"15"}>สัญญา</th>
                <th colSpan="9">ยืนยันยอด</th>
              </tr>
              <tr>
                <th>ครั้งที่เสนอคณะกรรมการ</th>
                <th>วันที่เสนอคณะกรรมการ</th>
                <th>เลขบัตรประชาชน</th>
                <th>คำนำหน้า</th>
                <th>ชื่อ-นามสกุล</th>
                <th>จังหวัด</th>
                <th>ประเภทเจ้าหนี้</th>
                <th>สถาบันเจ้าหนี้</th>
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
                <th>วัตถุประสงค์การกู้</th>       
                <th>รายละเอียดวัตถุประสงค์การกู้</th> 
                <th>ซื้อทรัพย์ตามระเบียบฯ</th>                  
                <th>ประเภทหลักประกัน</th>
                <th>ราคาขายทรัพย์ NPA</th>
                <th>เจ้าหนี้รับชำระต้นเงินคงเหลือ (NPL)</th>
                <th>ค่าใช้จ่ายในการดำเนินคดี</th>
                <th>ค่าเบี้ยประกัน</th>
                <th>รวมค่าใช้จ่าย</th>
                <th>รวมทั้งสิ้น</th>
                <th>สถานะหนี้</th>
                <th>สถานะยืนยันยอด</th>
                <th>ผลการยืนยันยอด</th>
              </tr>
            </thead>
            <tbody className="list text-center align-middle" id="bulk-select-body">
              {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index, selected[index]))) : (
                <tr>
                  <td className="fs-9 text-center align-middle" colSpan={38}>
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
      {can_action && (
        <div className="d-flex align-items-center justify-content-center my-3">
          <div className={`${isSome ? '' : 'd-none'}`}>
            <div className="d-flex">
              <button className="btn btn-info btn-sm ms-2" type="button" onClick={() => handleShowCreditor()}>เพิ่มหนังสือเจ้าหนี้</button>
              <button className="btn btn-primary btn-sm ms-2" type="button" onClick={() => handleShowCommittee()}>แก้ไขคณะกรรมการจัดการหนี้</button>
              <button className="btn btn-subtle-success btn-sm ms-2" type="button" onClick={() => onSubmit()}>เลือกสัญญายืนยันยอด</button>
            </div>
          </div>
        </div>
      )}
      <CustomerModal isOpen={isOpenCreditor} setModal={setOpenCreditor} 
        onOk={() => submitCreditor()} 
        title={'เพิ่มหนังสือเจ้าหนี้'} 
        okText={'บันทึก'} size={'xl'}
        onClose={() => handleCloseCreditor()}
        closeText={'ปิด'} centered
      >
        <form>
          <br />
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-6">
              <BookNo title={'เลขที่หนังสือเจ้าหนี้ยืนยันยอด'} containerClassname={'mb-3'} handleChange={(val) => setCreditorNo(val)} value={creditorNo} />
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6">
              <DatePicker title={'วันที่หนังสือเจ้าหนี้ยืนยันยอด'}
                value={creditorDate} 
                handleChange={(val) => setCreditorDate(val)} 
              />
            </div>
            <div className="d-flex">
              <h5><div className="flex-grow-1 ">จำนวน {count} ราย ,{contracts} สัญญา ,ยอดเงินรวม {sumTotal} บาท</div></h5>
            </div>
          </div>
        </form>
      </CustomerModal>
      <CustomerModal isOpen={isOpenCommittee} setModal={setOpenCommittee} 
        onOk={() => submitCommittee()} 
        title={'แก้ไขครั้งที่/วันที่เสนอคณะกรรมการ'} 
        okText={'บันทึก'} size={'xl'}
        onClose={() => handleCloseCommittee()}
        closeText={'ปิด'} centered
      >
        <form>
          <br />
          <div className="row">
            <div className="col-sm-12 col-md-12 col-lg-6">
              <BookNo title={'ครั้งที่เสนอคณะกรรมการ'} containerClassname={'mb-3'} handleChange={(val) => setCommitteeNo(val)} value={committeeNo} />
            </div>
            <div className="col-sm-12 col-md-12 col-lg-6">
              <DatePicker title={'วันที่เสนอคณะกรรมการ'}
                value={committeeDate} 
                handleChange={(val) => setCommitteeDate(val)} 
              />
            </div>
            <div className="d-flex">
              <h5><div className="flex-grow-1 ">จำนวน {count} ราย ,{contracts} สัญญา ,ยอดเงินรวม {sumTotal} บาท</div></h5>
            </div>
          </div>
        </form>
      </CustomerModal>
      {isOpenDetail && (
        <EditDetail isOpen={isOpenDetail} setModal={setOpenDetail} onClose={() => handleCloseDetail()} 
          data={editData}
        />
      )}
    </>
  );
};
export default SearchTable;