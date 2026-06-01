import { useEffect, useState } from "react";
import { Button } from 'reactstrap';
import { stringToDateTh, toCurrency, getBookNo, ToDateDb } from "@utils";
import DatePicker from "@views/components/input/DatePicker";
import Textbox from "@views/components/input/Textbox";
import BookNo from "@views/components/input/BookNo";
import DeleteModal from "@views/components/modal/customModal";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";
const RefundTable = (props) => {
  const [book_no, setBookNo] = useState(null);
  const [book_date, setBookDate] = useState(null);
  const [reason, setReason] = useState(null);
  const { data, onSave } = props;
  const [coop, setCoop] = useState(true);
  const handleSubmit = async () => {
    if(onSave) {
      await onSave(book_no, book_date, reason);
    }
  }
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">{index + 1}</td>
        <td>{item.book_no}</td>
        <td>{item.book_date}</td>
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

        <td>{toCurrency(item.debt_manage_outstanding_principal_pay)}</td>
        <td>{toCurrency(item.debt_manage_accrued_interest_pay)}</td>
        <td>{toCurrency(item.debt_manage_fine_pay)}</td>
        <td>{toCurrency(item.debt_manage_litigation_expenses_pay)}</td>
        <td>{toCurrency(item.debt_manage_forfeiture_withdrawal_fee_pay)}</td>
        {!coop && (
          <>
            <td>{toCurrency(item.debt_manage_insurance_premium_pay)}</td>
            <td>{toCurrency(item.debt_manage_other_expenses_pay)}</td>
          </>
        )}
        <td>{toCurrency(item.debt_manage_total_expenses_pay)}</td>
        <td>{toCurrency(item.debt_manage_total_pay)}</td>

        <td>{toCurrency(item.debt_manage_outstanding_principal_additional)}</td>
        <td>{toCurrency(item.debt_manage_accrued_interest_additional)}</td>
        <td>{toCurrency(item.debt_manage_fine_additional)}</td>
        <td>{toCurrency(item.debt_manage_litigation_expenses_additional)}</td>
        <td>{toCurrency(item.debt_manage_forfeiture_withdrawal_fee_additional)}</td>
        {!coop && (
          <>
            <td>{toCurrency(item.debt_manage_insurance_premium_additional)}</td>
            <td>{toCurrency(item.debt_manage_other_expenses_additional)}</td>
          </>
        )}
        <td>{toCurrency(item.debt_manage_total_expenses_additional)}</td>
        <td>{toCurrency(item.debt_manage_total_additional)}</td>

        <td>{item.reason}</td>
        <td>{item.debt_management_audit_status}</td>
      </tr>
    ))
  }
  const RenderAll = () => {
    return (data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
      <tr>
        <td className="fs-9 text-center align-middle" colSpan={coop ? 34 : 40}>
          <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
        </td>
      </tr>
    )
  }
  const fetchData = async () => {
    await setCoop(data && data[0]?.debt_manage_creditor_type == 'สหกรณ์')
  }
  useEffect(() => {
    RenderAll();
    return () => { console.log('Clear data.') }
  },[data])
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
                          <th className="white-space-nowrap fs-9 align-middle ps-0" rowSpan="2">#</th>
                          <th colSpan="2">รับคืนเงินชำระหนี้</th>
                          <th colSpan="2">คณะกรรมการจัดการหนี้</th>
                          <th colSpan="4">เกษตรกร</th>
                          <th colSpan="4">เจ้าหนี้</th>
                          <th colSpan={coop ? "8" : "10"}>โอนเงินให้สาขา</th>
                          <th colSpan={coop ? "7" : "9"}>ชำระหนี้แทน</th>
                          <th colSpan={coop ? "7" : "9"}>เพิ่มเงินชำระหนี้เกษตรกร</th>
                          <th rowSpan="2">หมายเหตุ</th>
                          <th rowSpan="2">สถานะสัญญา</th>
                        </tr>
                        <tr>
                <th>เลขที่หนังสือสาขา</th>
                <th>วันที่หนังสือสาขา</th>
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
                        </tr>
                      </thead>
                      <tbody className="list text-center align-middle" id="bulk-select-body">
                        {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
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
                  <BookNo title={'เลขที่หนังสือจัดการหนี้'} subtitle={'กฟก '+ getBookNo() } containerClassname={'mb-3'} handleChange={(val) => setBookNo(val)} value={book_no} />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-6">
                  <DatePicker title={'วันที่หนังสือจัดการหนี้'}
                    value={book_date} 
                    handleChange={(val) => setBookDate(val)} 
                  />
                </div>
                <div className="col-sm-12 col-md-12 col-lg-12">
                  <Textbox title={'หมายเหตุ'}
                    handleChange={(val) => setReason(val)}
                    containerClassname={'mb-3'} value={reason}
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