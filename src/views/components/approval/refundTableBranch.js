import { useEffect, useState } from "react";
import { Button } from 'reactstrap';
import { stringToDateTh, toCurrency, getBookNo, ToDateDb } from "@utils";
import DatePicker from "@views/components/input/DatePicker";
import BookNo from "@views/components/input/BookNo";
import DeleteModal from "@views/components/modal/customModal";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";
import { 
  getRefundPetition,
  updateRefundPetition,
} from "@services/api";
const RefundTable = () => {
  const [data, setData] = useState(null);
  const [selected, setSelected] = useState([]);
  const [isSome, setIsSome] = useState(false);
  const [isAll, setIsAll] = useState(false);
  const [book_no, setBookNo] = useState(null);
  const [book_date, setBookDate] = useState(null);
  const [coop, setCoop] = useState(true);
  
  const handleSubmit = async () => {
    const ids = data.filter((i, index) => selected[index]).map(i => i.id_debt_management);
    const params = {
      book_no: book_no,
      book_date: ToDateDb(book_date),
      debt_management_type: 'NPL',
      ids: ids
    }
    const result = await updateRefundPetition(params);
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'บันทึกสำเร็จ'} />
      ));
      await setLoadPetition(true);
    }
    else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'บันทึกไม่สำเร็จ'} />
      ));
    }
  }
  const onChange = async (id) => {
    const newSelected = [
      ...(selected.map((item, index) => (id == index ? !item : item))),
    ]
    await setSelected((prev) => {
      prev[id] = !prev[id];
      return [...prev]
    })
  }
  const onHeaderChange = async (checked) => {
    await setSelected(data.map(() => checked));
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
        <td>{item.debt_manage_contract_no}</td>
        <td>{toCurrency(item.debt_manage_outstanding_principal)}</td>
        <td>{toCurrency(item.debt_manage_accrued_interest)}</td>
        <td>{toCurrency(item.debt_manage_fine)}</td>
        <td>{toCurrency(item.debt_manage_litigation_expenses)}</td>
        <td>{toCurrency(item.debt_manage_forfeiture_withdrawal_fee)}</td>
        {!coop && (
          <>
            <td>{toCurrency(item.debt_manage_insurance_premium)}</td>
            <td>{toCurrency(item.debt_manage_other_expenses)}</td>
          </>
        )}
        <td>{toCurrency(item.debt_manage_total_expenses)}</td>
        <td>{toCurrency(item.debt_manage_total)}</td>
        <td>{item.debt_manage_objective_details}</td>
        <td>{item.debt_manage_status}</td>
        <td>{item.collateral_type}</td>
        <td>{item.collateral_no}</td>
        <td>{item.debt_management_audit_status}</td>
      </tr>
    ))
  }
  const RenderAll = () => {
    return (data && data.length > 0) ? (data.map((item,index) => RenderData(item, index, selected[index] ?? false))) : (
      <tr>
        <td className="fs-9 text-center align-middle" colSpan={coop ? 24 : 26}>
          <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
        </td>
      </tr>
    )
  }
  const fetchData = async () => {
    const result = await getRefundPetition();
    if (result.isSuccess) {
      await setCoop(result.data && result.data[0]?.debt_manage_creditor_type == 'สหกรณ์')
      await setData(result.data);
      await setSelected(result.data.map(() => false));
    } else {
      await setData(null);
    }
  }
  useEffect(() => {
    setIsSome(selected.some(i => i))
    setIsAll(selected.every(i => i) && selected.length > 0)
    RenderAll();
    return () => { console.log('Clear data.') }
  },[selected])
  useEffect(() => {
    fetchData();
  },[])
  return (
    <>
      <form>
        <div className="row">
          <div className="col-12">
            <div className="card p-3">
              <div className="row">
                <div className="col-12 p-3">
                  <div className="table-responsive mx-n1 px-1">
                    <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                      <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                        <tr>
                          <th className="white-space-nowrap fs-9 align-middle ps-0" rowSpan="2">
                            <div className="form-check ms-2 mb-0 fs-8">
                              <input className={`form-check-input ${(isSome && !isAll && data.length > 0) ? 'some' : ''}`} type="checkbox" checked={isAll} onChange={() => onHeaderChange(!isAll)} />
                            </div>
                          </th>
                          <th colSpan="2">คณะกรรมการจัดการหนี้</th>
                          <th colSpan="4">เกษตรกร</th>
                          <th colSpan="4">เจ้าหนี้</th>
                          <th colSpan={coop ? "11" : "13"}>สัญญา</th>
                          <th>หลักทรัพย์ค้ำประกัน</th>
                          <th rowSpan="2">สถานะสัญญา</th>
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
                          <th>เลขที่สัญญา</th>
                          <th>เงินต้น</th>
                          <th>ดอกเบี้ย</th>
                          <th>ค่าปรับ</th>
                          <th>ค่าใช้จ่ายในการดำเนินคดี</th>
                          <th>ค่าถอนการยึดทรัพย์</th>
                          {!coop && (
                            <>
                              <th>ค่าเบี้ยประกัน</th>
                              <th>ค่าใช้จ่ายอื่นๆ</th>
                            </>
                          )}
                          <th>รวมค่าใช้จ่าย</th>
                          <th>รวมทั้งสิ้น</th>
                          <th>วัตถุประสงค์การกู้</th>
                          <th>สถานะหนี้</th>
                          <th>ประเภทหลักประกัน</th>
                          <th>ประเภทและเลขที่หลักทรัพย์(เลขโฉนด)</th>
                        </tr>
                      </thead>
                      <tbody className="list text-center align-middle" id="bulk-select-body">
                        {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index, selected[index]))) : (
                          <tr>
                            <td className="fs-9 text-center align-middle" colSpan={coop ? 24 : 26}>
                              <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6">
                  <BookNo title={'เลขที่หนังสือ'} subtitle={'กฟก '+ getBookNo() } containerClassname={'mb-3'} handleChange={(val) => setBookNo(val)} value={book_no} />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6">
                  <DatePicker title={'วันที่หนังสือ'}
                    value={book_date} 
                    handleChange={(val) => setBookDate(val)} 
                  />
                </div>
              </div>
              <div className="row">
                <div className="col-12 pt-3 d-flex justify-content-center">
                  <Button color="success" onClick={() => handleSubmit()}>{'บันทึก'}</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
};
export default RefundTable;