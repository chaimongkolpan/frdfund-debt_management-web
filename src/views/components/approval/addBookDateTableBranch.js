import { useEffect, useState } from "react";
import { Button } from 'reactstrap';
import { stringToDateTh, toCurrency, getBookNo } from "@utils";
import DatePicker from "@views/components/input/DatePicker";
import BookNo from "@views/components/input/BookNo";
import DeleteModal from "@views/components/modal/customModal";
import toast from "react-hot-toast";
import ToastContent from "@views/components/toast/success";
import ToastError from "@views/components/toast/error";
import { 
  cleanData,
  getPetitionBranchList,
  getPetitionById,
  deletePetition,
} from "@services/api";
const BookDateTable = (props) => {
  const { savePetition, setSavePetition, loadPetition, setLoadPetition, handleSavePetition } = props;
  const [data, setData] = useState(null);
  const [filter, setFilter] = useState({
    currentPage: 1,
    pageSize: 0
  });
  const [showDetail, setShowDetail] = useState(false);
  const [petition, setPetition] = useState(null);
  const [id_petition, setIdPetition] = useState(null);
  const [isOpenDelete, setShowDelete] = useState(false);
  const [detail, setDetail] = useState(null);
  const [coop, setCoop] = useState(true);
  const [contracts, setContracts] = useState(null);
  const onChange = async (key, val) => {
    await setSavePetition((prevState) => ({
      ...prevState,
      ...({[key]: val})
    }))
  }
  const GetDetail = async (item) => {
    await setShowDetail(false);
    await setDetail(null);
    await setIdPetition(item.id_petition);
    const result = await getPetitionById(item.id_petition);
    if (result.isSuccess) {
      await setSavePetition((prevState) => ({
        ...prevState,
        id_petition: item.id_petition,
        petition_no_branch: null,
        petition_date_branch: null,
      }))
      await setPetition(item);
      await setDetail(result.data);
      await setCoop(result.contracts && result.contracts[0]?.debt_manage_creditor_type == 'สหกรณ์')
      await setContracts(result.contracts);
      await setShowDetail(true);
    }
  }
  const handleDeletePetitionSubmit = async () => {
    const result = await deletePetition(id_petition);
    if (result.isSuccess) {
      toast((t) => (
        <ToastContent t={t} title={'บันทึกข้อมูล'} message={'ลบฎีกาสำเร็จ'} />
      ));
      await setShowDetail(false);
      await setLoadPetition(true);
      await fetchData();
    } else {
      toast((t) => (
        <ToastError t={t} title={'บันทึกข้อมูล'} message={'ลบไม่สำเร็จ'} />
      ));
    }
  }
  const handleDeletePetition = async () => {
    await setShowDelete(true);
  }
  const RenderData = (item, index) => {
    return (item && (
      <tr key={index}>
        <td>{index + 1}</td>
        <td><div className="d-flex justify-content-center"><button type="button" className="btn btn-phoenix-secondary btn-icon fs-7 text-success-dark px-0" onClick={() => GetDetail(item)}><i className="far fa-list-alt "></i></button></div></td>
        <td>{stringToDateTh(item.created_at,false)}</td>
        <td>{item.num_of_farmers}</td>
        <td>{item.num_of_contracts}</td>
        <td>{item.disbursement}</td>
        <td>{item.num_of_Cheques}</td>
        <td>{toCurrency(item.petition_amount)}</td>
      </tr>
    ))
  }
  const RenderDataContracts = (item, index) => {
    return (item && (
      <tr key={index}>
        <td className="fs-9 align-middle">{index + 1}</td>
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
  const RenderDetail = (item, index) => {
    return (item && (
      <tr key={index}>
        <td>{item.cheques_no}</td>
        <td>{toCurrency(item.cashier_check_amount)}</td>
        <td>{item.disbursement}</td>
      </tr>
    ))
  }
  const fetchData = async () => {
    const result = await getPetitionBranchList(filter);
    if (result.isSuccess) {
      await setLoadPetition(false);
      await setShowDetail(false);
      await setData(result.data);
    } else {
      await setData(null);
    }
  }
  useEffect(() => {
    if (loadPetition) fetchData();
  },[loadPetition])
  return (
    <>
      {isOpenDelete && (
        <DeleteModal isOpen={isOpenDelete} setModal={setShowDelete} 
          title={'ลบฎีกา'} 
          onClose={() => setShowDelete(false)} closeText={'ยกเลิก'}
          onOk={() => handleDeletePetitionSubmit()} okText={'ลบ'} okColor={'danger'}
          scrollable={true}
        >{'คุณยืนยันที่จะลบฎีกานี้ใช่หรือไม่?'}</DeleteModal>
      )}
      <form>
        <div className="row">
          <div className="col-12 p-3">
            <div>
              <div className="table-responsive mx-n1 px-1">
                <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: "#d9fbd0", border: "#cdd0c7" }}>
                  <tr>
                    <th style={{ minWidth: 30 }}>#</th>
                    <th>รายละเอียด</th>
                    <th>วันที่สร้างฎีกา</th>
                    <th>จำนวนราย</th>
                    <th>จำนวนสัญญา</th>
                    <th>เบิกจ่ายให้</th>
                    <th>จำนวนเช็ค/โอนเงิน</th>
                    <th>จำนวนเงิน</th>
                  </tr>
                </thead>
                  <tbody className="list text-center align-middle">
                    {(data && data.length > 0) ? (data.map((item,index) => RenderData(item, index))) : (
                      <tr>
                        <td className="fs-9 text-center align-middle" colSpan={8}>
                          <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          {showDetail && (
            <div className="col-12">
              <div className="card p-3">
                <div className="d-flex  justify-content-center p-3">
                  <h5><div className="flex-grow-1 ">เพิ่มเลขที่/วันที่หนังสือ</div></h5>
                </div>
                <div className="d-flex justify-content-start">
                  <h5>
                    <div className="flex-grow-1">วันที่สร้างฎีกา : {stringToDateTh(petition.created_at,false)}</div>
                    <div className="flex-grow-1">จำนวนราย : {petition.num_of_farmers}</div>
                    <div className="flex-grow-1">จำนวนสัญญา : {petition.num_of_contracts}</div>
                  </h5>
                </div>
                <div className="row">
                  <div className="col-12 p-3">
                    <div className="table-responsive mx-n1 px-1">
                      <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                        <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: '#d9fbd0',border: '#cdd0c7' }}>
                          <tr>
                            <th className="white-space-nowrap fs-9 align-middle ps-0" rowSpan="2" style={{ minWidth: 30 }}>#</th>
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
                          {(contracts && contracts.length > 0) ? (contracts.map((item,index) => RenderDataContracts(item, index))) : (
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
                  <div className="col-12 p-3">
                    <div>
                      <div className="table-responsive mx-n1 px-1">
                        <table className="table table-sm table-striped table-bordered fs-9 mb-0">
                        <thead className="align-middle text-center text-nowrap" style={{ backgroundColor: "#d9fbd0", border: "#cdd0c7" }}>
                          <tr>
                            <th>เช็คที่/โอนครั้งที่</th>
                            <th>จำนวนเงินเบิกจ่าย</th>
                            <th>เบิกจ่ายให้</th>
                          </tr>
                        </thead>
                          <tbody className="list text-center align-middle">
                            {(detail && detail.length > 0) ? (detail.map((item,index) => RenderDetail(item, index))) : (
                              <tr>
                                <td className="fs-9 text-center align-middle" colSpan={3}>
                                  <div className="mt-5 mb-5 fs-8"><h5>ไม่มีข้อมูล</h5></div>
                                </td>
                              </tr>
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <BookNo title={'เลขที่หนังสือฎีกา'} subtitle={'กฟก '+ getBookNo() } containerClassname={'mb-3'} handleChange={(val) => onChange('petition_no_branch',val)} value={savePetition?.petition_no_branch} />
                  </div>
                  <div className="col-sm-12 col-md-12 col-lg-6">
                    <DatePicker title={'วันที่หนังสือฎีกา'}
                      value={savePetition?.petition_date_branch} 
                      handleChange={(val) => onChange('petition_date_branch',val)} 
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-12 pt-3 d-flex justify-content-center">
                    <Button color="success" onClick={() => handleSavePetition(savePetition)}>{'บันทึก'}</Button>
                    &nbsp;&nbsp;
                    <Button color="danger" onClick={() => handleDeletePetition()}>{'ลบ'}</Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </form>
    </>
  );
};
export default BookDateTable;